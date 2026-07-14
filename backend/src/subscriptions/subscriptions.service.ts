import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Subscription, SubscriptionStatus } from './subscription.entity';
import { Payment, PaymentMethod, PaymentStatus } from './payment.entity';
import { PlansService } from '../plans/plans.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { RegisterPaymentDto } from './dto/register-payment.dto';
import { addDaysISO, laterISO, todayISO } from '../common/utils/date.util';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    private readonly plansService: PlansService,
  ) {}

  // Alta de una cuota nueva para un socio (al registrarse o al elegir plan).
  // Queda con el primer pago pendiente hasta que se registre en portería/online.
  async subscribe(
    userId: string,
    dto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const plan = await this.plansService.findById(dto.planId);
    if (!plan) {
      throw new NotFoundException('El plan indicado no existe');
    }

    const targetUserId = dto.userId ?? userId;
    const startDate = todayISO();
    const dueDate = addDaysISO(startDate, plan.durationDays);

    const subscription = this.subscriptionsRepository.create({
      userId: targetUserId,
      planId: plan.id,
      startDate,
      dueDate,
      status: SubscriptionStatus.ACTIVE,
    });
    const saved = await this.subscriptionsRepository.save(subscription);

    await this.paymentsRepository.save(
      this.paymentsRepository.create({
        subscriptionId: saved.id,
        amount: plan.price,
        method: PaymentMethod.CASH,
        status: PaymentStatus.PENDING,
      }),
    );

    return this.findOneOrFail(saved.id);
  }

  // Renovación: extiende el vencimiento y registra el pago como realizado.
  // Si la cuota ya venció, la nueva fecha se cuenta desde hoy; si todavía
  // está vigente, se cuenta desde el vencimiento actual (no se pierden días).
  async renew(
    subscriptionId: string,
    dto: RegisterPaymentDto,
  ): Promise<Subscription> {
    const subscription = await this.findOneOrFail(subscriptionId);
    const base = laterISO(subscription.dueDate, todayISO());
    const newDueDate = addDaysISO(base, subscription.plan.durationDays);

    subscription.dueDate = newDueDate;
    subscription.status = SubscriptionStatus.ACTIVE;
    await this.subscriptionsRepository.save(subscription);

    await this.paymentsRepository.save(
      this.paymentsRepository.create({
        subscriptionId,
        amount: dto.amount ?? subscription.plan.price,
        method: dto.method ?? PaymentMethod.CASH,
        status: PaymentStatus.PAID,
        paidAt: todayISO(),
      }),
    );

    return this.findOneOrFail(subscriptionId);
  }

  async cancel(subscriptionId: string): Promise<Subscription> {
    const subscription = await this.findOneOrFail(subscriptionId);
    subscription.status = SubscriptionStatus.CANCELLED;
    await this.subscriptionsRepository.save(subscription);
    return subscription;
  }

  findMine(userId: string): Promise<Subscription[]> {
    return this.subscriptionsRepository.find({
      where: { userId },
      relations: { payments: true },
      order: { createdAt: 'DESC' },
    });
  }

  findAll(status?: SubscriptionStatus): Promise<Subscription[]> {
    return this.subscriptionsRepository.find({
      where: status ? { status } : {},
      relations: { user: true, payments: true },
      order: { dueDate: 'ASC' },
    });
  }

  private async findOneOrFail(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { id },
      relations: { payments: true },
    });
    if (!subscription) {
      throw new NotFoundException('Suscripción no encontrada');
    }
    return subscription;
  }

  // Corre todos los días a la madrugada: marca como vencidas las cuotas
  // activas cuya fecha de vencimiento ya pasó.
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async markOverdueSubscriptions(): Promise<void> {
    const result = await this.subscriptionsRepository.update(
      { status: SubscriptionStatus.ACTIVE, dueDate: LessThan(todayISO()) },
      { status: SubscriptionStatus.EXPIRED },
    );
    if (result.affected) {
      this.logger.log(`${result.affected} cuota(s) marcadas como vencidas`);
    }
  }
}

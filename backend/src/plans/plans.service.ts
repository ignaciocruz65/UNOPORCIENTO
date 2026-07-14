import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './plan.entity';
import { CreatePlanDto } from './dto/create-plan.dto';

const DEFAULT_PLANS: Partial<Plan>[] = [
  {
    name: 'Pase diario',
    description: 'Ideal para probar el gimnasio o entrenar de visita.',
    price: 2500,
    durationDays: 1,
  },
  {
    name: 'Mensual',
    description: 'Acceso libre a musculación y clases grupales durante un mes.',
    price: 18000,
    durationDays: 30,
  },
  {
    name: 'Trimestral',
    description: 'El mismo acceso que el mensual, con descuento por pago trimestral.',
    price: 48000,
    durationDays: 90,
  },
];

@Injectable()
export class PlansService implements OnModuleInit {
  constructor(
    @InjectRepository(Plan)
    private readonly plansRepository: Repository<Plan>,
  ) {}

  // Carga planes por defecto la primera vez que arranca el backend,
  // así la landing siempre tiene algo para mostrar.
  async onModuleInit() {
    const count = await this.plansRepository.count();
    if (count === 0) {
      await this.plansRepository.save(this.plansRepository.create(DEFAULT_PLANS));
    }
  }

  findAllActive(): Promise<Plan[]> {
    return this.plansRepository.find({
      where: { active: true },
      order: { price: 'ASC' },
    });
  }

  findAll(): Promise<Plan[]> {
    return this.plansRepository.find({ order: { price: 'ASC' } });
  }

  create(dto: CreatePlanDto): Promise<Plan> {
    const plan = this.plansRepository.create(dto);
    return this.plansRepository.save(plan);
  }
}

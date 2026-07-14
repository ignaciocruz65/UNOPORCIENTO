import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Plan } from '../plans/plan.entity';
import { Payment } from './payment.entity';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.subscriptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Plan, { eager: true })
  @JoinColumn({ name: 'planId' })
  plan: Plan;

  @Column()
  planId: string;

  @Column({ type: 'date' })
  startDate: string;

  // Fecha de vencimiento de la cuota actual. Se recalcula en cada renovación.
  @Column({ type: 'date' })
  dueDate: string;

  @Column({ type: 'varchar', default: SubscriptionStatus.ACTIVE })
  status: SubscriptionStatus;

  @OneToMany(() => Payment, (payment) => payment.subscription)
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

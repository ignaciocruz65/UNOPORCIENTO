import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Subscription } from './subscription.entity';

export enum PaymentStatus {
  PAID = 'paid',
  PENDING = 'pending',
}

export enum PaymentMethod {
  CASH = 'cash',
  TRANSFER = 'transfer',
  CARD = 'card',
  OTHER = 'other',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Subscription, (subscription) => subscription.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subscriptionId' })
  subscription: Subscription;

  @Column()
  subscriptionId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', default: PaymentMethod.CASH })
  method: PaymentMethod;

  @Column({ type: 'varchar', default: PaymentStatus.PENDING })
  status: PaymentStatus;

  // Fecha en la que efectivamente se pagó (null mientras está pendiente)
  @Column({ type: 'date', nullable: true })
  paidAt?: string | null;

  @CreateDateColumn()
  createdAt: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Subscription } from '../subscriptions/subscription.entity';

export enum UserRole {
  MEMBER = 'member',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  dni: string;

  @Column({ type: 'date' })
  birthDate: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: 'varchar', default: UserRole.MEMBER })
  role: UserRole;

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

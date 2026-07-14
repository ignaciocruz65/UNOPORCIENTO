import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  name: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: 'varchar', default: UserRole.MEMBER })
  role: UserRole;

  // Referencia al plan actual del socio. Se deja como columna simple
  // (en vez de relación completa) para poder evolucionar fácil hacia
  // un módulo de "membresías" con historial, pagos, vencimientos, etc.
  @Column({ nullable: true })
  planId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

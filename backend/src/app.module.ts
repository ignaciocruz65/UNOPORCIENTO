import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PlansModule } from './plans/plans.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { InstagramModule } from './instagram/instagram.module';
import { User } from './users/user.entity';
import { Plan } from './plans/plan.entity';
import { Subscription } from './subscriptions/subscription.entity';
import { Payment } from './subscriptions/payment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DB_PATH ?? 'unoporciento.sqlite',
      entities: [User, Plan, Subscription, Payment],
      // synchronize=true es cómodo para arrancar rápido en desarrollo.
      // Cuando el proyecto pase a producción con más tablas (clases,
      // check-ins QR, etc.) conviene migrar a migraciones de TypeORM.
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    PlansModule,
    SubscriptionsModule,
    InstagramModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

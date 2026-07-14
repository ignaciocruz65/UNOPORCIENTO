import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './subscription.entity';
import { Payment } from './payment.entity';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { PlansModule } from '../plans/plans.module';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, Payment]), PlansModule],
  providers: [SubscriptionsService],
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { RegisterPaymentDto } from './dto/register-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { SubscriptionStatus } from './subscription.entity';

@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  // El socio logueado se anota a un plan (o un admin lo hace por él con userId)
  @Post()
  subscribe(@Req() req: any, @Body() dto: CreateSubscriptionDto) {
    return this.subscriptionsService.subscribe(req.user.userId, dto);
  }

  // Historial de cuotas del socio logueado
  @Get('me')
  findMine(@Req() req: any) {
    return this.subscriptionsService.findMine(req.user.userId);
  }

  @Post(':id/renew')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  renew(@Param('id') id: string, @Body() dto: RegisterPaymentDto) {
    return this.subscriptionsService.renew(id, dto);
  }

  @Post(':id/cancel')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  cancel(@Param('id') id: string) {
    return this.subscriptionsService.cancel(id);
  }

  // Listado general para el futuro panel de administración
  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(@Query('status') status?: SubscriptionStatus) {
    return this.subscriptionsService.findAll(status);
  }
}

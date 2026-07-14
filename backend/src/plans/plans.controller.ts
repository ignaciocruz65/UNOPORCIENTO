import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  // Público: lo que se muestra en la landing del gimnasio
  @Get()
  findAllActive() {
    return this.plansService.findAllActive();
  }

  // Solo admin: pensado para el futuro panel de administración
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreatePlanDto) {
    return this.plansService.create(dto);
  }
}

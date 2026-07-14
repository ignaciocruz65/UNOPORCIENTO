import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateSubscriptionDto {
  @IsUUID()
  planId: string;

  // Solo lo usa un admin para dar de alta la cuota de otro socio
  // (por ejemplo, alguien que se anota en el mostrador sin usar la web).
  @IsOptional()
  @IsNotEmpty()
  @IsUUID()
  userId?: string;
}

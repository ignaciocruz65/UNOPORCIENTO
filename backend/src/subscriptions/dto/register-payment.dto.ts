import { IsEnum, IsOptional, IsPositive } from 'class-validator';
import { PaymentMethod } from '../payment.entity';

export class RegisterPaymentDto {
  // Si no se manda, se usa el precio del plan vigente
  @IsOptional()
  @IsPositive()
  amount?: number;

  @IsOptional()
  @IsEnum(PaymentMethod)
  method?: PaymentMethod;
}

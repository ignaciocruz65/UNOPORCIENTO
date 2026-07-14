import { IsDateString, IsEmail, IsNotEmpty, IsOptional, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  firstName: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  lastName: string;

  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @Matches(/^\d{7,9}$/, { message: 'El DNI debe tener entre 7 y 9 dígitos' })
  dni: string;

  @IsDateString({}, { message: 'La fecha de nacimiento no es válida' })
  birthDate: string;

  @IsOptional()
  phone?: string;

  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}

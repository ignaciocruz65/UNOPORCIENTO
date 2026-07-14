import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html'
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Señales para manejar estados de la interfaz
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Llamamos al AuthService y enviamos el payload
    this.authService.login(this.loginForm.getRawValue() as any).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']); // Redirigimos al inicio si hay éxito
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Credenciales incorrectas. Intentá nuevamente.');
      }
    });
  }
}
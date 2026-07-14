import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
})
export class Navbar {
  // Inyectamos el servicio para leer el signal currentUser
  authService = inject(AuthService);
  private router = inject(Router);

  // Controlamos el menú móvil con un signal
  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  logout() {
    this.authService.logout();
    this.isMenuOpen.set(false); // Cerramos el menú móvil si estaba abierto
    this.router.navigate(['/login']);
  }
}
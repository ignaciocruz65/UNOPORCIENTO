import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlansService } from '../../core/services/plans.service';
import { InstagramService } from '../../core/services/instagram.service';
import { InstagramPost, Plan } from '../../core/models/gym.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private readonly plansService = inject(PlansService);
  private readonly instagramService = inject(InstagramService);

  readonly plans = signal<Plan[]>([]);
  readonly loadingPlans = signal(true);

  readonly instagramPosts = signal<InstagramPost[]>([]);
  readonly instagramConfigured = signal(true);
  readonly loadingInstagram = signal(true);

  readonly schedule = [
    { day: 'Lunes a Viernes', hours: '07:00 – 22:00' },
    { day: 'Sábados', hours: '09:00 – 19:00' },
    { day: 'Domingos', hours: 'Cerrado' },
  ];

  readonly features = [
    {
      title: 'Musculación',
      desc: 'Sala equipada para entrenar a tu ritmo, con o sin rutina asignada.',
    },
    {
      title: 'Clases grupales',
      desc: 'Funcional, spinning y más — muy pronto con reserva de cupo online.',
    },
    {
      title: 'Ingreso con QR',
      desc: 'Accedé al gimnasio escaneando tu carnet digital, sin filas.',
    },
    {
      title: 'Seguimiento',
      desc: 'Tu progreso y estado de cuota, disponible desde tu perfil.',
    },
  ];

  ngOnInit(): void {
    this.plansService.getActivePlans().subscribe({
      next: (plans) => {
        this.plans.set(plans);
        this.loadingPlans.set(false);
      },
      error: () => this.loadingPlans.set(false),
    });

    this.instagramService.getFeed().subscribe({
      next: (res) => {
        this.instagramConfigured.set(res.configured);
        this.instagramPosts.set(res.posts);
        this.loadingInstagram.set(false);
      },
      error: () => this.loadingInstagram.set(false),
    });
  }
}

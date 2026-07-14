import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Plan } from '../models/gym.models';

@Injectable({ providedIn: 'root' })
export class PlansService {
  private readonly http = inject(HttpClient);

  getActivePlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${environment.apiUrl}/plans`);
  }
}

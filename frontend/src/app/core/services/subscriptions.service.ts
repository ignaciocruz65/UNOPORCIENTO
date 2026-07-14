import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Subscription } from '../models/gym.models';

@Injectable({ providedIn: 'root' })
export class SubscriptionsService {
  private readonly http = inject(HttpClient);

  subscribe(planId: string): Observable<Subscription> {
    return this.http.post<Subscription>(`${environment.apiUrl}/subscriptions`, {
      planId,
    });
  }

  getMine(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${environment.apiUrl}/subscriptions/me`);
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { InstagramPost } from '../models/gym.models';

export interface InstagramFeedResponse {
  configured: boolean;
  posts: InstagramPost[];
}

@Injectable({ providedIn: 'root' })
export class InstagramService {
  private readonly http = inject(HttpClient);

  getFeed(): Observable<InstagramFeedResponse> {
    return this.http.get<InstagramFeedResponse>(`${environment.apiUrl}/instagram/posts`);
  }
}

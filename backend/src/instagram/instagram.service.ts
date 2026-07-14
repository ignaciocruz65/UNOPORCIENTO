import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface InstagramPost {
  id: string;
  caption?: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  permalink: string;
  timestamp: string;
}

const GRAPH_API_VERSION = 'v21.0';
// Cache simple en memoria: la Graph API tiene un límite de ~200
// llamadas por hora por usuario, así que no tiene sentido pegarle en
// cada visita a la landing.
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutos

@Injectable()
export class InstagramService {
  private readonly logger = new Logger(InstagramService.name);
  private cache: { fetchedAt: number; posts: InstagramPost[] } | null = null;

  constructor(private readonly configService: ConfigService) {}

  isConfigured(): boolean {
    return !!(this.accessToken && this.igUserId);
  }

  private get accessToken(): string | undefined {
    return this.configService.get<string>('INSTAGRAM_ACCESS_TOKEN');
  }

  private get igUserId(): string | undefined {
    return this.configService.get<string>('INSTAGRAM_BUSINESS_ACCOUNT_ID');
  }

  async getRecentPosts(limit = 6): Promise<InstagramPost[]> {
    if (!this.isConfigured()) {
      // Sin cuenta Business + token no hay forma de traer posts reales
      // (Meta deprecó el acceso a cuentas personales). Devolvemos vacío
      // para que el frontend pueda mostrar un estado "no conectado".
      return [];
    }

    if (this.cache && Date.now() - this.cache.fetchedAt < CACHE_TTL_MS) {
      return this.cache.posts.slice(0, limit);
    }

    try {
      const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
      const url =
        `https://graph.facebook.com/${GRAPH_API_VERSION}/${this.igUserId}/media` +
        `?fields=${fields}&access_token=${this.accessToken}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Instagram API respondió ${response.status}`);
      }

      const data = (await response.json()) as {
        data: Array<{
          id: string;
          caption?: string;
          media_type: string;
          media_url: string;
          thumbnail_url?: string;
          permalink: string;
          timestamp: string;
        }>;
      };

      const posts: InstagramPost[] = data.data.map((item) => ({
        id: item.id,
        caption: item.caption,
        mediaType: item.media_type,
        mediaUrl: item.media_url,
        thumbnailUrl: item.thumbnail_url,
        permalink: item.permalink,
        timestamp: item.timestamp,
      }));

      this.cache = { fetchedAt: Date.now(), posts };
      return posts.slice(0, limit);
    } catch (error) {
      this.logger.error('No se pudo obtener el feed de Instagram', error as Error);
      // Si falla, devolvemos lo último cacheado (si hay) antes que nada
      return this.cache?.posts.slice(0, limit) ?? [];
    }
  }
}

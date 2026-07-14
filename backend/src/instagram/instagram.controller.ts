import { Controller, Get } from '@nestjs/common';
import { InstagramService } from './instagram.service';

@Controller('instagram')
export class InstagramController {
  constructor(private readonly instagramService: InstagramService) {}

  @Get('posts')
  async getPosts() {
    const posts = await this.instagramService.getRecentPosts();
    return {
      configured: this.instagramService.isConfigured(),
      posts,
    };
  }
}

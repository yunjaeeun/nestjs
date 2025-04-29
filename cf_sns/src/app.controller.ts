import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';


interface Post {
  id: number;
  name: string;
  count: number;
}

let posts = [
  {
    id: 1,
    name: '민지',
    count: 12312312
  },
  {
    id: 2,
    name: '해린',
    count: 99999999
  }
]

@Controller('posts')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getPosts() {
    return this.appService.getPosts;
  }

  @Get(':id')
  getPost(@Param('id') id: string) {
    
    return this.appService.getPost(id)
  }

  @Post()
  postPost(
    @Body() post:Post
  ) {
    return this.appService.postPost(post);
  }

  @Patch(':id')
  patchPost(
    @Param('id') id: string,
    @Body() post:Post
  ) {
    return this.appService.patchPost(id, post)
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    const findPost = posts.findIndex((post) => post.id === +id)

  }
}

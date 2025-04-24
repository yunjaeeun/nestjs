import { Body, Injectable, NotFoundException, Param } from '@nestjs/common';

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


@Injectable()
export class AppService {
  getPosts() {
    return posts;
  }

  getPost(id: string) {
    const post = posts.find((post) => post.id === +id)
    
    /* find는 찾지 못하면 undefined 반환 */
    if (!post) {
      throw new NotFoundException
    }

    return post
  }

  postPost(post:Post) {
    posts.push(post);

    return posts;
  }

  patchPost(id: string, post:Post) {
    const findPost = posts.findIndex((post) => post.id === +id)

    posts[findPost].name = post.name
    posts[findPost].count = post.count

    return posts
  }

  deletePost(id: string) {
    const findPost = posts.findIndex((post) => post.id === +id)

  }

}

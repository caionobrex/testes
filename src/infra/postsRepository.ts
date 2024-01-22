import { IPostsRepository } from '../domain/postsRepository';
import { Post as PostEntity } from '../infra/typeorm/data-source';
import { Repository } from "typeorm";
import { Post } from '../domain/post';

export class PostsRepository implements IPostsRepository {
  constructor(private readonly postsRepository: Repository<PostEntity>) {}

  async findById(id: string): Promise<Post | undefined> {
    const post = await this.postsRepository.findOneBy({ id })
    return post ? new Post(post.id, post.likesCount) : undefined
  }

  async update(post: Post): Promise<void> {
    await this.postsRepository.update(post.id, { id: post.id, likesCount: post.likesCount })
  }

  async save(post: Post): Promise<void> {
    await this.postsRepository.save({ id: post.id, likesCount: post.likesCount })
  }
}

export class StubPostsRepository implements IPostsRepository {
  #posts = [new Post('1'), new Post('2')]

  async findById(id: string): Promise<Post | undefined> {
    return this.#posts.find(post => post.id === id)
  }

  async update(post: Post): Promise<void> {
    this.#posts.map((p) => p.id === post.id ? post : p)
  }

  save(_post: Post): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
import { Post } from "./post";

export interface IPostsRepository {
  findById(id: string): Promise<Post | undefined>

  update(post: Post): Promise<void>

  save(post: Post): Promise<void>
}

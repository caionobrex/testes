import { Post } from "./post"

export class User {
  #id: string
  #email: string
  #likedPosts: Post[]

  constructor(id: string, email: string, likedPosts?: Post[]) {
    this.#id = id
    this.#email = email;
    this.#likedPosts = likedPosts ?? []
  }

  likes(post: Post) {
    const hasUserLikedPost = this.#likedPosts.find((post) => post.id)
    if (hasUserLikedPost) {
      throw new Error('Post already liked')
    }
    post.incrementLikesCount()
    this.#likedPosts.push(post)
  }

  get id(): string {
    return this.#id
  }

  get email(): string {
    return this.#email
  }

  get likedPosts(): Post[] {
    return this.#likedPosts
  }
}

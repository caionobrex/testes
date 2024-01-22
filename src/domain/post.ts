export class Post {
  #id: string
  #likesCount: number

  constructor(id: string, likesCount?: number) {
    this.#id = id
    this.#likesCount = likesCount ?? 0
  }

  incrementLikesCount() {
    this.#likesCount++
  }

  get id(): string {
    return this.#id
  }

  get likesCount(): number {
    return this.#likesCount
  }
}

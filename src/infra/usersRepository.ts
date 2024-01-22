import { Repository } from "typeorm";
import { Post } from "../domain/post";
import { User } from "../domain/user";
import { IUsersRepository } from "../domain/usersRepository";
import { Post as PostEntity, User as UserEntity } from '../infra/typeorm/data-source';

export class UsersRepository implements IUsersRepository {
  constructor(private readonly usersRepository: Repository<UserEntity>) {}

  async findById(id: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { id }, relations: { likedPosts: true }})
    const likedPosts = user?.likedPosts.map((likedPost) => new Post(likedPost.id, likedPost.likesCount))
    return user ? new User(user.id, user.email, likedPosts) : undefined;
  }

  async update(user: User): Promise<void> {
    const u = new UserEntity()
    u.id = user.id
    u.email = user.email
    const likedPosts = user.likedPosts.map(({ id, likesCount }) => {
      const post = new PostEntity()
      post.id = id
      post.likesCount = likesCount
      return post
    })
    await Promise.all([
      this.usersRepository.createQueryBuilder().relation(UserEntity, 'likedPosts').of(u).add(likedPosts),
      this.usersRepository.update(u.id, u)
    ])
  }

  async save(user: User): Promise<void> {
    const u = new UserEntity()
    u.id = user.id
    u.email = user.email
    u.likedPosts = user.likedPosts.map(({ id, likesCount }) => {
      const p = new PostEntity()
      p.id = id
      p.likesCount = likesCount
      return p
    })
    await this.usersRepository.save(u)
  }
}

export class StubUsersRepository implements IUsersRepository {
  #users = [new User('1', 'test@gmail.com'), new User('2', 'test2@gmail.com')]

  async findById(id: string): Promise<User | undefined> {
    return this.#users.find(user => user.id === id)
  }

  async update(user: User): Promise<void> {
    this.#users.map((u) => u.id === user.id ? user : u)
  }

  save(_user: User): Promise<void> {
    throw new Error("Method not implemented.");
  }
} 
import { User } from "./user";

export interface IUsersRepository {
  findById(id: string): Promise<User | undefined>

  update(user: User): Promise<void>

  save(user: User): Promise<void>
}



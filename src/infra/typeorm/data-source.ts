import { Column, DataSource, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  email: string

  @ManyToMany(() => Post, { eager: true, cascade: true })
  @JoinTable()
  likedPosts: Post[]
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ default: 0 })
  likesCount: number
}

export const appDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "toor",
  database: "mydb",
  synchronize: true,
  logging: false,
  entities: [User, Post],
  subscribers: [],
  migrations: [],
})

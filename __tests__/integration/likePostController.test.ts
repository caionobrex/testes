import { randomUUID } from "crypto"
import { QueryBuilder } from "typeorm"
import { addTransactionalDataSource, initializeTransactionalContext } from "typeorm-transactional"
import { UsersController } from "../../src/application/usersController"
import { Post } from "../../src/domain/post"
import { User } from "../../src/domain/user"
import { PostsRepository } from "../../src/infra/postsRepository"
import { Post as PostEntity, User as UserEntity, appDataSource } from "../../src/infra/typeorm/data-source"
import { UsersRepository } from "../../src/infra/usersRepository"
import { MockedSmtpService } from "../../src/smtpService"

initializeTransactionalContext()
addTransactionalDataSource(appDataSource)

const clearData = async (queryBuilder: QueryBuilder<any>) => {
    await Promise.all([
      queryBuilder.delete().from(UserEntity).execute(),
      queryBuilder.delete().from(PostEntity).execute(),
    ])
}

describe('LikePost Controller', () => {
  const typeormUsersRepository = appDataSource.getRepository<UserEntity>(UserEntity)
  const typeormPostsRepository = appDataSource.getRepository<PostEntity>(PostEntity)
  const queryBuilder =  appDataSource.createQueryBuilder()

  beforeAll(() => {
    return appDataSource.initialize()
  })

  beforeEach(() => {
    return clearData(queryBuilder)
  })

  test('successfully like post', async () => {
    const usersRepository = new UsersRepository(typeormUsersRepository)
    const postsRepository = new PostsRepository(typeormPostsRepository)
    const smtpService = new MockedSmtpService()
    const userId = randomUUID()
    const postId = randomUUID()
    await usersRepository.save(new User(userId, 'caio@gmail.com'))
    await postsRepository.save(new Post(postId))
    const postBeforeLike = await postsRepository.findById(postId)
    const sut = new UsersController(usersRepository, postsRepository, smtpService)

    await sut.likePost(userId, postId)

    const postAfterLike = await postsRepository.findById(postId)
    const userAfterLike = await usersRepository.findById(userId)
    expect(postAfterLike?.likesCount).toEqual(postBeforeLike!.likesCount + 1)
    expect(userAfterLike?.likedPosts.length).toBe(1)
  })

  afterAll(() => {
    return appDataSource.destroy()
  })
})

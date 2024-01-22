import express from 'express'
import { UsersController } from './application/usersController'
import { PostsRepository } from './infra/postsRepository'
import { addTransactionalDataSource, initializeTransactionalContext } from 'typeorm-transactional'
import {  Post as PostEntity, User as UserEntity, appDataSource } from './infra/typeorm/data-source'
import { UsersRepository } from './infra/usersRepository'
import { SmtpService } from './smtpService'
import { randomUUID } from 'crypto'
import bodyParser from 'body-parser'

initializeTransactionalContext()
addTransactionalDataSource(appDataSource)

const typeormUsersRepository = appDataSource.getRepository<UserEntity>(UserEntity)
const typeormPostsRepository = appDataSource.getRepository<PostEntity>(PostEntity)

const app = express()

const usersController = new UsersController(
  new UsersRepository(typeormUsersRepository),
  new PostsRepository(typeormPostsRepository),
  new SmtpService()
)

let userId = 'e46643dc-465f-4b60-85c2-e94112c98f76'

app.use(bodyParser.json())

app.post('/signup', async (req, res) => {
  userId = randomUUID()
  await typeormUsersRepository.save({ id: userId, email: req.body.email })
  res.json({ message: 'success' })
})

app.post('/login', async (_req, res) => {
  res.json({ token: userId })
})

app.post('/posts', async (_req, res) => {
  const post = await typeormPostsRepository.save({})
  res.send({ post })
})

app.post('/posts/:id/likePost', async (req, res) => {
  await usersController.likePost(userId, req.params.id)
  res.json({ msg: 'success' })
})

const main = async () => {
  await appDataSource.initialize()
  app.listen(3000, () => console.log('Running'))
}

main()
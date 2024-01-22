import 'axios'
import axios, { Axios } from 'axios'
import { appDataSource, User as UserEntity, Post as PostEntity } from '../../src/infra/typeorm/data-source'
import { QueryBuilder } from 'typeorm'

const clearData = async (queryBuilder: QueryBuilder<any>) => {
  await Promise.all([
    queryBuilder.delete().from(UserEntity).execute(),
    queryBuilder.delete().from(PostEntity).execute(),
  ])
}

describe('LikePost', () => {
  const queryBuilder =  appDataSource.createQueryBuilder()
  let httpClient: Axios

  beforeAll(() => {
    httpClient = axios.create({ baseURL: 'http://localhost:3000' })
    return appDataSource.initialize()
  })

  beforeEach(() => {
    return clearData(queryBuilder)
  })

  test('successfully like post', async () => {
    await httpClient.post('signup', {
      email: 'test@gmail.com',
      password: '12345'
    })
    const { data: { token } } = await httpClient.post('login', {
      email: 'test@gmail.com',
      password: '12345'
    })
    const headers = { headers: { 'Authorization': `Bearer ${token}` } }
    const { data } = await httpClient.post('posts', { title: 'Test' }, headers)

    const sut = await httpClient.post(`posts/${data.post.id}/likePost`, headers)

    expect(sut.status).toBe(200)
    expect(sut.data.msg).toEqual('success')
  })

  afterAll(() => {
    return appDataSource.destroy()
  })
})

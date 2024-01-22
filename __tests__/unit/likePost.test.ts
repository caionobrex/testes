import { Post } from "../../src/domain/post"
import { User } from "../../src/domain/user"

describe('LikePost', () => {
  it('successfully like post', () => {
    const sut = new User('1', 'test@gmail.com')
    const post = new Post('1')

    sut.likes(post)

    expect(post.likesCount).toBe(1)
    expect(sut.likedPosts).toEqual([post])
  })

  it('like post fails', () => {
    const post = new Post('1')
    const sut = new User('1', 'test@gmail.com', [post])

    const result = () => sut.likes(post)

    expect(result).toThrow()
  })
})

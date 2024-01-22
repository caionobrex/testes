import { IPostsRepository } from "../domain/postsRepository";
import { IUsersRepository } from "../domain/usersRepository";
import { ISmtpService } from "../smtpService";

export class UsersController {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly postsRepository: IPostsRepository,
    private readonly smtpService: ISmtpService,
  ) {}

  async likePost(userId: string, postId: string) {
    const user = await this.usersRepository.findById(userId);
    const post = await this.postsRepository.findById(postId);
    if (!user || !post) return
    user.likes(post)
    await this.postsRepository.update(post)
    await this.usersRepository.update(user)
    this.smtpService.sendEmail(user.email, "Like", "You liked a post")
  }
}

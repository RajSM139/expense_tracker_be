import { Controller, UseGuards, Post } from '@nestjs/common';
import { FirebaseAuthGuard } from '@middleware/firebase-auth';
import { UserContext } from '@common/user-context';

@Controller('auth')
export class AuthController {
  @UseGuards(FirebaseAuthGuard)
  @Post('token-check')
  getProtected() {
    return { message: 'Access granted', user: UserContext.getUser() };
  }
}

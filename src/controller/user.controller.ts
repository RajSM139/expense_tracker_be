import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '@middleware/firebase-auth';
import { UserContext } from '@common/user-context';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateUserDto,
  CreateUserRequestDto,
  UserProfileDto,
  CreateUserProfileDto,
} from '@model/user.dto';
import { UserService } from '@service/user.service';
import { customHttpStatus } from '@utils/status-codes.util';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(public userService: UserService) {}

  @Get('profile')
  @ApiOperation({
    summary: 'Get User Profile',
    description: 'Retrieves the profile of the authenticated user.',
  })
  @UseGuards(FirebaseAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully.',
    type: UserProfileDto,
  })
  getProfile(): UserProfileDto {
    return this.userService.getUserProfile(UserContext.getUser());
  }

  @Post('create')
  @ApiOperation({
    summary: 'Create User Profile',
    description: 'Creates a new user profile for a Firebase-authenticated user. The client must provide a valid Firebase ID token in the Authorization header. Only extra profile data (firstName, lastName, etc.) is accepted.'
  })
  @ApiResponse({
    status: customHttpStatus('USER_CREATED').statusCode,
    description: customHttpStatus('USER_CREATED').message,
    type: CreateUserDto,
  })
  @UseGuards(FirebaseAuthGuard)
  async createUserProfile(
    @Body() createUserDto: CreateUserProfileDto,
  ): Promise<CreateUserDto> {
    const context = UserContext.getUser();
    // Only allow extra profile fields to be set by user
    const userProfile = await this.userService.createUserProfile(
      context,
      createUserDto,
    );
    return userProfile;
  }
}

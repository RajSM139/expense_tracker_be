import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '@middleware/firebase-auth';
import { UserContext } from '@common/user-context';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateUserDto,
  CreateUserRequestDto,
  UserProfileDto,
} from '@model/user.dto';
import { UserService } from '@service/user.service';
import { customHttpStatus } from '@utils/status-codes.util';

@ApiTags('Users')
@Controller('users')
export class UserController {
  userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

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
    description: 'Creates a new user profile with the provided details.',
  })
  @ApiParam({
    name: 'createUserDto',
    description: 'The user profile data to create.',
    type: CreateUserRequestDto,
  })
  @ApiResponse({
    status: customHttpStatus('USER_CREATED').statusCode,
    description: customHttpStatus('USER_CREATED').message,
    type: CreateUserDto,
  })
  async createUserProfile(
    @Body() createUserDto: CreateUserRequestDto,
  ): Promise<CreateUserDto> {
    const context = UserContext.getUser();
    const userProfile = await this.userService.createUserProfile(
      context,
      createUserDto,
    );
    return userProfile;
  }
}

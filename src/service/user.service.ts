import {
  CreateUserDto,
  UserProfileDto,
  CreateUserProfileDto,
} from '@model/user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DecodedIdToken } from 'firebase-admin/auth';
import { User } from '@entities/user.entity';
import { customHttpStatus } from '@utils/status-codes.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserProfile(context: DecodedIdToken): Promise<UserProfileDto> {
    const user = await this.userRepository.findOne({
      where: { firebaseUid: context.user_id as string },
    });

    if (!user) {
      const { message, statusCode } = customHttpStatus('USER_NOT_FOUND');
      throw new HttpException({ message, statusCode }, HttpStatus.NOT_FOUND);
    }

    return {
      userId: user.firebaseUid,
      email: user.email,
      emailVerified: user.emailVerified,
      mobile: user.mobile,
      mobileVerified: user.mobileVerified,
      userType: user.userType,
    };
  }

  async createUserProfile(
    context: DecodedIdToken,
    userProfile: CreateUserProfileDto,
  ): Promise<CreateUserDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { firebaseUid: context.user_id as string },
    });

    if (existingUser) {
      const { message, statusCode } = customHttpStatus('USER_ALREADY_EXISTS');
      throw new HttpException({ message, statusCode }, HttpStatus.CONFLICT);
    }

    // Create new user
    const newUser = this.userRepository.create({
      firebaseUid: context.user_id as string,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      email: context.email,
      mobile: context.phone_number || null,
      emailVerified: context.email_verified,
      mobileVerified: Boolean(context.phone_number_verified) || false,
      userType: (context.user_type as 'free' | 'paid') || 'free',
    });

    const savedUser = await this.userRepository.save(newUser);

    return {
      userId: savedUser.firebaseUid,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      mobile: savedUser.mobile,
      emailVerified: savedUser.emailVerified,
      mobileVerified: savedUser.mobileVerified,
      userType: savedUser.userType,
    };
  }

  async findUserByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { firebaseUid },
    });
  }

  async updateUserProfile(
    firebaseUid: string,
    updateData: Partial<User>,
  ): Promise<User> {
    const user = await this.findUserByFirebaseUid(firebaseUid);
    if (!user) {
      const { message, statusCode } = customHttpStatus('USER_NOT_FOUND');
      throw new HttpException({ message, statusCode }, HttpStatus.NOT_FOUND);
    }

    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }
}

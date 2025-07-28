import {
  CreateUserDto,
  UserProfileDto,
  CreateUserProfileDto,
} from '@model/user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/auth';
import { FirestoreService } from './firestore.service';
import { customHttpStatus } from '@utils/status-codes.util';

@Injectable()
export class UserService {
  // This service can be used to manage user-related operations
  // For example, fetching user profiles, updating user information, etc.

  constructor(private readonly firestoreService: FirestoreService) {}
  private readonly collectionName = 'users';

  getUserProfile(context: DecodedIdToken): UserProfileDto {
    return {
      userId: context.user_id as string,
      email: context.email,
      emailVerified: context.email_verified,
      mobile: context.phone_number,
      mobileVerified: (context.phone_number_verified as boolean) || false,
      userType: context.user_type as 'free' | 'paid',
    };
  }

  async createUserProfile(
    context: DecodedIdToken,
    userProfile: CreateUserProfileDto,
  ): Promise<CreateUserDto> {
    const newUserProfile: CreateUserDto = {
      userId: context.user_id as string,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      gender: userProfile?.gender || 'Prefer not to say',
      dob: userProfile?.dob || '',
      email: context.email,
      mobile: context.phone_number || undefined,
      emailVerified: context.email_verified,
      mobileVerified: (context.phone_number_verified as boolean) || false,
      userType: context.user_type as 'free' | 'paid',
    };
    const existingProfile = await this.firestoreService.getDocument(
      this.collectionName,
      context.user_id as string,
    );
    // If the user profile already exists, update it
    if (existingProfile) {
      const { message, statusCode } = customHttpStatus('USER_ALREADY_EXISTS');
      throw new HttpException({ message, statusCode }, HttpStatus.CONFLICT);
    }
    // Set the user profile in Firestore
    const response = await this.firestoreService.createDocument(
      this.collectionName,
      { ...newUserProfile },
    );
    // Return the user profile as a DTO
    return response ? newUserProfile : null;
  }
}

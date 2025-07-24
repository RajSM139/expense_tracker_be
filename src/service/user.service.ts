import {
  CreateUserDto,
  CreateUserRequestDto,
  UserProfileDto,
} from '@model/user.dto';
import { Injectable } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/auth';
import { FirestoreService } from './firestore.service';
import { customHttpStatus } from '@utils/status-codes.util';

@Injectable()
export class UserService {
  // This service can be used to manage user-related operations
  // For example, fetching user profiles, updating user information, etc.

  private readonly firestoreService: FirestoreService;
  constructor() {
    this.firestoreService = new FirestoreService();
  }
  private readonly collectionName = 'users';

  getUserProfile(context: DecodedIdToken): UserProfileDto {
    return {
      userId: context.user_id,
      email: context.email,
      emailVerified: context.email_verified,
    };
  }

  async createUserProfile(
    context: DecodedIdToken,
    userProfile: CreateUserRequestDto,
  ): Promise<CreateUserDto> {
    console.log('🚀 ~ UserService ~ createUserProfile ~ context:', context);
    const newUserProfile: CreateUserDto = {
      userId: context.user_id,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      gender: userProfile?.gender || 'Prefer not to say',
      dob: userProfile?.dob || '',
    };
    const existingProfile = await this.firestoreService.getDocument(
      this.collectionName,
      context.user_id,
    );
    // If the user profile already exists, update it
    if (existingProfile) {
      const { message, statusCode } = customHttpStatus('USER_ALREADY_EXISTS');
      throw new Error(`${statusCode}: ${message}`);
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

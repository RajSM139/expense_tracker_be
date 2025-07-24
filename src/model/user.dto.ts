import { ApiProperty } from '@nestjs/swagger';

export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export type UserType = 'free' | 'paid';

export class UserProfileDto {
  @ApiProperty({ example: '4S74PCiGJMNLh6PUjV4d1xvWYX22', description: 'The unique identifier of the user' })
  userId: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'The email address of the user' })
  email: string;

  @ApiProperty({ example: '+1234567890', description: 'The mobile number of the user' })
  mobile: string;

  @ApiProperty({ example: true, description: 'Email verification status' })
  emailVerified: boolean;

  @ApiProperty({ example: false, description: 'Mobile verification status' })
  mobileVerified: boolean;

  @ApiProperty({ example: 'free', description: 'User type: free or paid' })
  userType: UserType;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Last login timestamp', required: false })
  lastLoginAt?: string;

  @ApiProperty({ example: 'John', description: 'The first name of the user', required: false })
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user', required: false })
  lastName?: string;

  @ApiProperty({ example: 'Male', description: 'Gender of the user', required: false })
  gender?: Gender;

  @ApiProperty({ example: 'YYYY-MM-DD', description: 'Date of birth of the user', required: false })
  dob?: string;
}

export class CreateUserRequestDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'The email address of the user' })
  email: string;

  @ApiProperty({ example: '+1234567890', description: 'The mobile number of the user' })
  mobile: string;

  @ApiProperty({ example: 'password123', description: 'The password for the user' })
  password: string;

  @ApiProperty({ example: 'John', description: 'The first name of the user', required: false })
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user', required: false })
  lastName?: string;

  @ApiProperty({ example: 'Male', description: 'Gender of the user', required: false })
  gender?: Gender;

  @ApiProperty({ example: 'YYYY-MM-DD', description: 'Date of birth of the user', required: false })
  dob?: string;
}

export class CreateUserDto {
  @ApiProperty({ example: '4S74PCiGJMNLh6PUjV4d1xvWYX22', description: 'The unique identifier of the user' })
  userId: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'The email address of the user' })
  email: string;

  @ApiProperty({ example: '+1234567890', description: 'The mobile number of the user' })
  mobile: string;

  @ApiProperty({ example: 'free', description: 'User type: free or paid' })
  userType: UserType;

  @ApiProperty({ example: true, description: 'Email verification status' })
  emailVerified: boolean;

  @ApiProperty({ example: false, description: 'Mobile verification status' })
  mobileVerified: boolean;

  @ApiProperty({ example: 'John', description: 'The first name of the user', required: false })
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user', required: false })
  lastName?: string;

  @ApiProperty({ example: 'Male', description: 'Gender of the user', required: false })
  gender?: Gender;

  @ApiProperty({ example: 'YYYY-MM-DD', description: 'Date of birth of the user', required: false })
  dob?: string;
}

export class UserDto {
  @ApiProperty({ example: '4S74PCiGJMNLh6PUjV4d1xvWYX22', description: 'The unique identifier of the user' })
  id: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'The email address of the user' })
  email: string;

  @ApiProperty({ example: '+1234567890', description: 'The mobile number of the user' })
  mobile: string;

  @ApiProperty({ example: 'hashed_password', description: 'The hashed password of the user' })
  passwordHash: string;

  @ApiProperty({ example: true, description: 'Email verification status' })
  emailVerified: boolean;

  @ApiProperty({ example: false, description: 'Mobile verification status' })
  mobileVerified: boolean;

  @ApiProperty({ example: 'free', description: 'User type: free or paid' })
  userType: UserType;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'User creation timestamp' })
  createdAt: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'User update timestamp' })
  updatedAt: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Last login timestamp', required: false })
  lastLoginAt?: string;

  @ApiProperty({ example: 'magic-link-token', description: 'Magic link token for email verification', required: false })
  magicLinkToken?: string;

  @ApiProperty({ example: '2024-01-01T00:05:00.000Z', description: 'Magic link expiry timestamp', required: false })
  magicLinkExpiresAt?: string;

  @ApiProperty({ example: '123456', description: 'OTP for mobile verification', required: false })
  otp?: string;

  @ApiProperty({ example: '2024-01-01T00:05:00.000Z', description: 'OTP expiry timestamp', required: false })
  otpExpiresAt?: string;

  @ApiProperty({ example: { google: 'google-id', facebook: 'facebook-id' }, description: 'Social accounts for paid users', required: false, type: Object })
  socialAccounts?: Record<string, string>;
}

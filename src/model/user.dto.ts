import { ApiProperty } from '@nestjs/swagger';

export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export class UserProfileDto {
  @ApiProperty({
    example: '4S74PCiGJMNLh6PUjV4d1xvWYX22',
    description: 'The unique identifier of the user',
  })
  userId: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
  })
  email: string;

  @ApiProperty({ example: false, description: 'Email Verification status' })
  emailVerified: boolean;

  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  firstName?: string;
  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  lastName?: string;
  @ApiProperty({
    example: 'Male',
    description: 'Gender of the user',
    required: false,
  })
  gender?: Gender;

  @ApiProperty({
    example: 'YYYY-MM-DD',
    description: 'Date of birth of the user',
    required: false,
  })
  dob?: string;
}

export class CreateUserRequestDto {
  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  lastName: string;

  @ApiProperty({
    example: 'Male',
    description: 'Gender of the user',
    required: false,
  })
  gender?: Gender;

  @ApiProperty({
    example: 'YYYY-MM-DD',
    description: 'Date of birth of the user',
    required: false,
  })
  dob?: string;
}

export class CreateUserDto {
  @ApiProperty({
    example: '4S74PCiGJMNLh6PUjV4d1xvWYX22',
    description: 'The unique identifier of the user',
  })
  userId: string;

  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  lastName: string;

  @ApiProperty({
    example: 'Male',
    description: 'Gender of the user',
    required: false,
  })
  gender?: Gender;

  @ApiProperty({
    example: 'YYYY-MM-DD',
    description: 'Date of birth of the user',
    required: false,
  })
  dob?: string;
}

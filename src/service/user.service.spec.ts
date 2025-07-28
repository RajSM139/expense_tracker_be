import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { FirestoreService } from './firestore.service';
import { DecodedIdToken } from 'firebase-admin/auth';
import { CreateUserProfileDto } from '../model/user.dto';
import { HttpException } from '@nestjs/common';

const mockFirestoreService = {
  getDocument: jest.fn(),
  createDocument: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let firestoreService: typeof mockFirestoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: FirestoreService, useValue: mockFirestoreService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    firestoreService = module.get(FirestoreService);
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should map context to UserProfileDto', () => {
      const context = {
        user_id: 'abc123',
        email: 'test@example.com',
        email_verified: true,
        phone_number: '+1234567890',
        phone_number_verified: true,
        user_type: 'free',
      } as unknown as DecodedIdToken;
      const result = service.getUserProfile(context);
      expect(result).toEqual({
        userId: 'abc123',
        email: 'test@example.com',
        emailVerified: true,
        mobile: '+1234567890',
        mobileVerified: true,
        userType: 'free',
      });
    });
  });

  describe('createUserProfile', () => {
    const context = {
      user_id: 'abc123',
      email: 'test@example.com',
      email_verified: true,
      phone_number: '+1234567890',
      phone_number_verified: true,
      user_type: 'free',
    } as unknown as DecodedIdToken;
    const createUserDto = {
      firstName: 'Jane',
      lastName: 'Smith',
      gender: 'female',
      dob: '1990-01-01',
    } as unknown as CreateUserProfileDto;

    it('should create and return new user profile if not exists', async () => {
      firestoreService.getDocument.mockResolvedValue(null);
      firestoreService.createDocument.mockResolvedValue({ id: 'docid' });
      const result = await service.createUserProfile(context, createUserDto);
      expect(result).toMatchObject({
        userId: 'abc123',
        firstName: 'Jane',
        lastName: 'Smith',
        gender: 'female',
        dob: '1990-01-01',
        email: 'test@example.com',
        mobile: '+1234567890',
        emailVerified: true,
        mobileVerified: true,
        userType: 'free',
      });
      expect(firestoreService.getDocument).toHaveBeenCalledWith(
        'users',
        'abc123',
      );
      expect(firestoreService.createDocument).toHaveBeenCalled();
    });

    it('should throw HttpException if user already exists', async () => {
      firestoreService.getDocument.mockResolvedValue({ userId: 'abc123' });
      try {
        await service.createUserProfile(context, createUserDto);
        fail('Expected HttpException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect((error as HttpException).getStatus()).toBe(409);
        expect((error as HttpException).getResponse()).toHaveProperty(
          'message',
          'User already exists.',
        );
      }
    });

    it('should return null if Firestore createDocument fails', async () => {
      firestoreService.getDocument.mockResolvedValue(null);
      firestoreService.createDocument.mockResolvedValue(undefined);
      const result = await service.createUserProfile(context, createUserDto);
      expect(result).toBeNull();
    });
  });
});

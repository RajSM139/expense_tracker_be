/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { FirebaseAuthGuard } from '../middleware/firebase-auth';
import { UserContext } from '../common/user-context';
import {
  CreateUserProfileDto,
  UserProfileDto,
  CreateUserDto,
} from '../model/user.dto';
import { DecodedIdToken } from 'firebase-admin/auth';

// Mock UserContext
jest.mock('../common/user-context', () => ({
  UserContext: {
    getUser: jest.fn(),
  },
}));

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUserProfile: jest.fn(),
            createUserProfile: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService);
  });

  describe('getProfile', () => {
    it('should return the user profile', () => {
      const mockUser = {
        user_id: '123',
        email: 'test@example.com',
      } as unknown as DecodedIdToken;
      const mockProfile = {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
      } as unknown as UserProfileDto;
      (UserContext.getUser as jest.Mock).mockReturnValue(mockUser);
      userService.getUserProfile.mockReturnValue(mockProfile);
      const result = controller.getProfile();
      expect(result).toBe(mockProfile);
      expect(userService.getUserProfile).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('createUserProfile', () => {
    it('should create and return the user profile', async () => {
      const mockUser = {
        user_id: '123',
        email: 'test@example.com',
      } as unknown as DecodedIdToken;
      const createUserDto = {
        firstName: 'Jane',
        lastName: 'Smith',
      } as unknown as CreateUserProfileDto;
      const createdUser = {
        id: '123',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'test@example.com',
      } as unknown as CreateUserDto;
      (UserContext.getUser as jest.Mock).mockReturnValue(mockUser);
      userService.createUserProfile.mockResolvedValue(createdUser);
      const result = await controller.createUserProfile(createUserDto);
      expect(result).toBe(createdUser);
      expect(userService.createUserProfile).toHaveBeenCalledWith(
        mockUser,
        createUserDto,
      );
    });

    it('should propagate HttpException if user already exists', async () => {
      const mockUser = {
        user_id: '123',
        email: 'test@example.com',
      } as unknown as DecodedIdToken;
      const createUserDto = {
        firstName: 'Jane',
        lastName: 'Smith',
      } as unknown as CreateUserProfileDto;
      (UserContext.getUser as jest.Mock).mockReturnValue(mockUser);
      const conflictError = new Error('User already exists') as Error & {
        status: number;
      };
      conflictError.status = 409;
      userService.createUserProfile.mockRejectedValue(conflictError);
      await expect(controller.createUserProfile(createUserDto)).rejects.toBe(
        conflictError,
      );
    });

    it('should return null if userService returns null', async () => {
      const mockUser = {
        user_id: '123',
        email: 'test@example.com',
      } as unknown as DecodedIdToken;
      const createUserDto = {
        firstName: 'Jane',
        lastName: 'Smith',
      } as unknown as CreateUserProfileDto;
      (UserContext.getUser as jest.Mock).mockReturnValue(mockUser);
      userService.createUserProfile.mockResolvedValue(null);
      const result = await controller.createUserProfile(createUserDto);
      expect(result).toBeNull();
    });
  });
});

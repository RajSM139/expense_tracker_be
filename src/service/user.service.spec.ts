/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from '@entities/user.entity';
import { DecodedIdToken } from 'firebase-admin/auth';
import { CreateUserProfileDto } from '@model/user.dto';
import { HttpException } from '@nestjs/common';

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should return user profile from database', async () => {
      const context = {
        user_id: 'abc123',
        email: 'test@example.com',
        email_verified: true,
        phone_number: '+1234567890',
        phone_number_verified: true,
        user_type: 'free',
      } as unknown as DecodedIdToken;

      const mockUser = {
        id: 'uuid-123',
        firebaseUid: 'abc123',
        email: 'test@example.com',
        emailVerified: true,
        mobile: '+1234567890',
        mobileVerified: true,
        userType: 'free',
        firstName: null,
        lastName: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getUserProfile(context);
      
      expect(result).toEqual({
        userId: 'abc123',
        email: 'test@example.com',
        emailVerified: true,
        mobile: '+1234567890',
        mobileVerified: true,
        userType: 'free',
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { firebaseUid: 'abc123' },
      });
    });

    it('should throw HttpException if user not found', async () => {
      const context = {
        user_id: 'abc123',
        email: 'test@example.com',
      } as unknown as DecodedIdToken;

      userRepository.findOne.mockResolvedValue(null);

      await expect(service.getUserProfile(context)).rejects.toThrow(HttpException);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { firebaseUid: 'abc123' },
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
    } as unknown as CreateUserProfileDto;

    it('should create and return new user profile if not exists', async () => {
      userRepository.findOne.mockResolvedValue(null);
      
      const mockCreatedUser = {
        id: 'uuid-123',
        firebaseUid: 'abc123',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'test@example.com',
        mobile: '+1234567890',
        emailVerified: true,
        mobileVerified: true,
        userType: 'free',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      userRepository.create.mockReturnValue(mockCreatedUser);
      userRepository.save.mockResolvedValue(mockCreatedUser);

      const result = await service.createUserProfile(context, createUserDto);
      
      expect(result).toMatchObject({
        userId: 'abc123',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'test@example.com',
        mobile: '+1234567890',
        emailVerified: true,
        mobileVerified: true,
        userType: 'free',
      });
      
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { firebaseUid: 'abc123' },
      });
      expect(userRepository.create).toHaveBeenCalledWith({
        firebaseUid: 'abc123',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'test@example.com',
        mobile: '+1234567890',
        emailVerified: true,
        mobileVerified: true,
        userType: 'free',
      });
      expect(userRepository.save).toHaveBeenCalledWith(mockCreatedUser);
    });

    it('should throw HttpException if user already exists', async () => {
      const existingUser = {
        id: 'uuid-123',
        firebaseUid: 'abc123',
        email: 'test@example.com',
        firstName: null,
        lastName: null,
        mobile: null,
        emailVerified: false,
        mobileVerified: false,
        userType: 'free',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      userRepository.findOne.mockResolvedValue(existingUser);

      await expect(service.createUserProfile(context, createUserDto)).rejects.toThrow(HttpException);
      
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { firebaseUid: 'abc123' },
      });
    });
  });

  describe('findUserByFirebaseUid', () => {
    it('should return user if found', async () => {
      const mockUser = {
        id: 'uuid-123',
        firebaseUid: 'abc123',
        email: 'test@example.com',
        firstName: null,
        lastName: null,
        mobile: null,
        emailVerified: false,
        mobileVerified: false,
        userType: 'free',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findUserByFirebaseUid('abc123');
      
      expect(result).toBe(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { firebaseUid: 'abc123' },
      });
    });

    it('should return null if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.findUserByFirebaseUid('abc123');
      
      expect(result).toBeNull();
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { firebaseUid: 'abc123' },
      });
    });
  });

  describe('updateUserProfile', () => {
    it('should update and return user profile', async () => {
      const existingUser = {
        id: 'uuid-123',
        firebaseUid: 'abc123',
        firstName: 'John',
        lastName: 'Doe',
        email: null,
        mobile: null,
        emailVerified: false,
        mobileVerified: false,
        userType: 'free',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      const updatedUser = {
        ...existingUser,
        firstName: 'Jane',
        lastName: 'Smith',
      } as User;

      userRepository.findOne.mockResolvedValue(existingUser);
      userRepository.save.mockResolvedValue(updatedUser);

      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const result = await service.updateUserProfile('abc123', updateData);
      
      expect(result).toBe(updatedUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { firebaseUid: 'abc123' },
      });
      expect(userRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should throw HttpException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.updateUserProfile('abc123', { firstName: 'Jane' })).rejects.toThrow(HttpException);
      
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { firebaseUid: 'abc123' },
      });
    });
  });
});

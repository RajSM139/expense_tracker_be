/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { FirebaseAuthGuard } from './firebase-auth';
import { UserContext } from '../common/user-context';

// Mock Firebase Admin
const mockVerifyIdToken = jest.fn();
jest.mock('firebase-admin', () => ({
  auth: jest.fn(() => ({
    verifyIdToken: mockVerifyIdToken,
  })),
}));

// Mock UserContext
jest.mock('../common/user-context', () => ({
  UserContext: {
    setUser: jest.fn(),
  },
}));

describe('FirebaseAuthGuard', () => {
  let guard: FirebaseAuthGuard;
  let mockContext: ExecutionContext;
  let mockRequest: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseAuthGuard],
    }).compile();

    guard = module.get<FirebaseAuthGuard>(FirebaseAuthGuard);

    mockRequest = {
      headers: {},
    };

    mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should return true for valid token', async () => {
      const mockDecodedToken = { user_id: '123', email: 'test@example.com' };
      mockVerifyIdToken.mockResolvedValue(mockDecodedToken);

      mockRequest.headers.authorization = 'Bearer valid-token';

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockVerifyIdToken).toHaveBeenCalledWith('valid-token');
      expect(UserContext.setUser).toHaveBeenCalledWith(mockDecodedToken);
    });

    it('should throw UnauthorizedException when no authorization header', async () => {
      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        new UnauthorizedException('No token provided'),
      );
    });

    it('should throw UnauthorizedException when authorization header does not start with Bearer', async () => {
      mockRequest.headers.authorization = 'Invalid valid-token';

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        new UnauthorizedException('No token provided'),
      );
    });

    it('should throw UnauthorizedException when token is invalid/expired', async () => {
      mockVerifyIdToken.mockRejectedValue(new Error('Token expired'));

      mockRequest.headers.authorization = 'Bearer invalid-token';

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        new UnauthorizedException('Invalid or expired token'),
      );
    });

    it('should throw UnauthorizedException when Firebase auth fails', async () => {
      mockVerifyIdToken.mockRejectedValue(new Error('Firebase error'));

      mockRequest.headers.authorization = 'Bearer valid-token';

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        new UnauthorizedException('Invalid or expired token'),
      );
    });

    it('should handle empty authorization header', async () => {
      mockRequest.headers.authorization = '';

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        new UnauthorizedException('No token provided'),
      );
    });

    it('should handle undefined authorization header', async () => {
      mockRequest.headers.authorization = undefined;

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        new UnauthorizedException('No token provided'),
      );
    });
  });
});

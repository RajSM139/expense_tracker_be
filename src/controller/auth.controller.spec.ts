import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { FirebaseAuthGuard } from '../middleware/firebase-auth';
import { UserContext } from '../common/user-context';

// Mock UserContext
jest.mock('../common/user-context', () => ({
  UserContext: {
    getUser: jest.fn(),
  },
}));

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should return access granted with user', () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    (UserContext.getUser as jest.Mock).mockReturnValue(mockUser);
    const result = controller.getProtected();
    expect(result).toEqual({ message: 'Access granted', user: mockUser });
  });
});

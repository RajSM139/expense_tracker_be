import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as admin from 'firebase-admin';
import { UserContext } from 'common/user-context';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers?.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const idToken = authHeader.split('Bearer ')[1];
    console.log('🚀 ~ FirebaseAuthGuard ~ canActivate ~ idToken:', idToken);

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      UserContext.setUser(decodedToken);
      return true;
    } catch (error) {
      console.error('Firebase authentication error:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

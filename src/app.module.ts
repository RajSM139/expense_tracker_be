import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthController, UserController } from './controller';
import { FirestoreService } from './service/firestore.service';
import { FirebaseAdminProviders } from './firebase-admin-init';
import { UserService } from './service/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, AuthController, UserController],
  providers: [AppService, FirestoreService, UserService, ...FirebaseAdminProviders],
  exports: [FirestoreService],
})
export class AppModule {}

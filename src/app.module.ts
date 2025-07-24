import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthController, UserController } from './controller';
import { FirestoreService } from './service/firestore.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, AuthController, UserController],
  providers: [AppService, FirestoreService],
  exports: [FirestoreService],
})
export class AppModule {}

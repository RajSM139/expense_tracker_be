import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthController, UserController } from './controller';
import { FirestoreService } from './service/firestore.service';
import { FirebaseAdminProviders } from './firebase-admin-init';
import { UserService } from '@service/user.service';
import { User } from '@entities/index';
import { getDatabaseConfig } from '@config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => getDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController, AuthController, UserController],
  providers: [
    AppService,
    FirestoreService,
    UserService,
    ...FirebaseAdminProviders,
  ],
  exports: [FirestoreService],
})
export class AppModule {}

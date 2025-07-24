import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export const FIREBASE_ADMIN = 'FIREBASE_ADMIN';

export const FirebaseAdminProvider: Provider = {
  provide: FIREBASE_ADMIN,
  useFactory: (configService: ConfigService) => {
    if (!admin.apps.length) {
      const serviceAccount = {
        type: 'service_account',
        project_id: configService.get<string>('PROJECT_ID'),
        private_key_id: configService.get<string>('PRIVATE_KEY_ID'),
        private_key: configService
          .get<string>('PRIVATE_KEY')
          ?.replace(/\\n/g, '\n'),
        client_email: configService.get<string>('CLIENT_EMAIL'),
        client_id: configService.get<string>('CLIENT_ID'),
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url:
          'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: configService.get<string>('CLIENT_X509_CERT_URL'),
        universe_domain: 'googleapis.com',
      };
      admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount,
        ),
      });
    }
    return admin;
  },
  inject: [ConfigService],
};

export const FirebaseAdminProviders = [FirebaseAdminProvider];

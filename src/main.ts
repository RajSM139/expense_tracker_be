import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './firebase-admin-init';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('TrackExpense API')
    .setDescription('API documentation for the TrackExpense backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}
bootstrap();

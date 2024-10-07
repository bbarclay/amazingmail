import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  
  // Use the PORT environment variable provided by Vercel, or default to 3000
  const port = process.env.PORT || 3000;
  await app.listen(port);
}

// For Vercel serverless deployment
export default async function handler(req, res) {
  const app = await NestFactory.create(AppModule);
  await app.init();
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
}

// Only call bootstrap if we're not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import envConfig from './shared/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = envConfig.PORT || 3000;

  app.enableCors({
    origin: '*', // cho phép tất cả domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
    exposedHeaders: ['Content-Disposition'],
  });

  await app.listen(port);
  console.log(`🏃‍♂️ bug-tracking-system-be running on http://localhost:${port}`);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('process.env.DB_HOST :>> ', process.env.DB_HOST);

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(5005);
}
bootstrap();

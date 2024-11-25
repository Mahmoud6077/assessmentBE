import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS (needed for your frontend)
  app.enableCors();

  // Using global validation pipe for DTOs
  app.useGlobalPipes(new ValidationPipe());

  const PORT = process.env.PORT || 3000;
  console.log(`Server is running on http://localhost:${PORT}`);
  await app.listen(PORT);
}

bootstrap();

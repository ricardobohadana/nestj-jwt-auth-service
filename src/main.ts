import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  app.useGlobalPipes(new ValidationPipe());

  // app.enableCors({
  //   origin: (requestOrigin, callback) => {
  //     return callback(null, true);
  //   },
  // });
  await app.listen(port || 3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);
  const port = config.get<number>('port');
  const mode = config.get<string>('mode');

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(port, () => {
    console.log(
      'Server is running:\n',
      `PORT: ${port}\n`,
      `MODE: ${mode}\n`,
      `TIME: ${new Date()}\n`,
    );
  });
}
bootstrap();

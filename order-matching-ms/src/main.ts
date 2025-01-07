import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initListener } from './config/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.ORDER_MATCHING_MS_PORT ?? 3003);
  await initListener();
}
bootstrap();

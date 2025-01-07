import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { generatePortfolioMessagesFromOrders } from './utils/generate-portfolio-messages.script';
import { OrderService } from './orders/order.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.INFORMATION_MS_PORT ?? 3001);
  await generatePortfolioMessagesFromOrders(app.get(OrderService));
  console.log(`information-ms is running on: ${await app.getUrl()}`);
}
bootstrap();

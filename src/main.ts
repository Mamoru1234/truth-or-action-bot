import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';

import { AppModule } from './app.module';
import { Telegraf } from 'telegraf';
import { logger } from './logger';
import { TgRouterService } from './modules/tg-router/tg-router.service';

async function main(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: WinstonModule.createLogger({
      instance: logger,
    }),
  });
  app.enableShutdownHooks();
  logger.info('Launching bot');
  const bot = app.get(Telegraf);
  const router = app.get(TgRouterService);
  router.configure();
  await bot.launch();
}

main().catch((e) => logger.error('error in main', e));

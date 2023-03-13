import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { createLogger, transports, format } from 'winston';
import { WinstonModule } from 'nest-winston';

import { AppModule } from './app.module';
import { Telegraf } from 'telegraf';
import { logMiddleware } from './modules/telegraf/log.middleware';
import { asyncHandlerWrapper } from './modules/telegraf/async-handler.wrapper';
import { chatTypePredicate } from './modules/telegraf/telegraf.filter';

const logger = createLogger({
  level: process.env.APP_LOG_LEVEL || 'info',
  transports: [
    new transports.Console({
      format: format.simple(),
    }),
  ],
});

async function main(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: WinstonModule.createLogger({
      instance: logger,
    }),
  });
  app.enableShutdownHooks();
  logger.info('Launching bot');
  const bot = app.get(Telegraf);
  bot.use(logMiddleware((mes, update) => logger.info(mes, {
    update,
  })));
  const privateChat = chatTypePredicate('private');
  bot.start(asyncHandlerWrapper(async (ctx) => {
    if (privateChat(ctx.update)) {
      await ctx.sendMessage('Hi please send me a token');
      return;
    }
    await ctx.sendMessage('Hi veerify your chat in PM');
  }, logger));
  bot.use(asyncHandlerWrapper(async (ctx) => {
    logger.info('received unknown message');
    await ctx.sendMessage('Something went wrong')
  }, logger));
  await bot.launch();
}

main().catch((e) => logger.error('error in main', e));
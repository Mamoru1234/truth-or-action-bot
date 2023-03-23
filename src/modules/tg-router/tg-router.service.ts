import { Injectable, Logger } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { asyncHandlerWrapper } from '../telegraf/async-handler.wrapper';
import { logMiddleware } from '../telegraf/log.middleware';
import { privateHanders } from '../tg-handlers/private';
import { TgHandlersService } from '../tg-handlers/tg-handlers.service';

@Injectable()
export class TgRouterService {
  private readonly logger = new Logger(TgRouterService.name);
  constructor(private readonly bot: Telegraf, private readonly tgHandlersService: TgHandlersService) {}

  configure(): void {
    this.bot.use(
      logMiddleware((mes, update) =>
        this.logger.log(mes, {
          update,
        }),
      ),
    );
    this.tgHandlersService.register(this.bot, privateHanders);
    this.bot.start(
      asyncHandlerWrapper(this.logger, async (ctx) => {
        await ctx.sendMessage('Hi verify your chat in PM');
      }),
    );
    this.bot.use(
      asyncHandlerWrapper(this.logger, async (ctx) => {
        this.logger.log('received unknown message', {
          id: ctx.update.update_id,
        });
        await ctx.sendMessage('Вибач я тебе не розумію)');
      }),
    );
  }
}

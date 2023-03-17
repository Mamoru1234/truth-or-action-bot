import { Injectable, Logger } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import {} from 'telegraf/filters';
import { asyncHandlerWrapper } from '../telegraf/async-handler.wrapper';
import { chatTypeGuardFactory } from '../telegraf/guard.utils';
import { logMiddleware } from '../telegraf/log.middleware';
import { combine, runWithGuard } from '../telegraf/run-with-guard.wrapper';
import { SessionGuardFactory } from '../tg-guards/session-guard.factory';
import { PrivateAuthTokenHandler } from '../tg-handlers/private/auth-token.handler';
import { PrivateStartCommandHandler } from '../tg-handlers/private/start-command.handler';

@Injectable()
export class TgRouterService {
  private readonly logger = new Logger(TgRouterService.name);
  constructor(
    private readonly privateStartCommandHandler: PrivateStartCommandHandler,
    private readonly bot: Telegraf,
    private readonly sessionGuardFactory: SessionGuardFactory,
    private readonly privateAuthTokenHandler: PrivateAuthTokenHandler
  ) {}

  configure(): void {
    this.bot.use(
      logMiddleware((mes, update) =>
        this.logger.log(mes, {
          update,
        })
      )
    );
    const privateChat = chatTypeGuardFactory('private');
    this.bot.start(runWithGuard(privateChat, this.logger, (ctx) => this.privateStartCommandHandler.handle(ctx)));
    this.bot.use(
      runWithGuard(combine(privateChat, this.sessionGuardFactory.noSession()), this.logger, (ctx) =>
        this.privateAuthTokenHandler.handle(ctx)
      )
    );
    this.bot.use(
      runWithGuard(combine(privateChat, this.sessionGuardFactory.withSession()), this.logger, (ctx) =>
        ctx.sendMessage('I am here with session')
      )
    );
    this.bot.start(
      asyncHandlerWrapper(this.logger, async (ctx) => {
        await ctx.sendMessage('Hi veerify your chat in PM');
      })
    );
    this.bot.use(
      asyncHandlerWrapper(this.logger, async (ctx) => {
        this.logger.log('received unknown message', {
          id: ctx.update.update_id,
        });
        await ctx.sendMessage('Something went wrong');
      })
    );
  }
}

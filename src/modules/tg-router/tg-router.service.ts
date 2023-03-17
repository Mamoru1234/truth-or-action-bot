import { Injectable, Logger } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { asyncHandlerWrapper } from '../telegraf/async-handler.wrapper';
import { chatTypeGuardFactory } from '../telegraf/guard.utils';
import { logMiddleware } from '../telegraf/log.middleware';
import { combine, runWithGuard } from '../telegraf/run-with-guard.wrapper';
import { ActiveStepGuardFactory } from '../tg-guards/active-step-guard.factory';
import { SessionGuardFactory } from '../tg-guards/session-guard.factory';
import { PrivateAuthTokenHandler } from '../tg-handlers/private/auth-token.handler';
import { PrivateSetGamePlayersHandler } from '../tg-handlers/private/set-game-players.handler';
import { PrivateStartCommandHandler } from '../tg-handlers/private/start-command.handler';
import { PrivateStartGameHandler } from '../tg-handlers/private/start-game.handler';

@Injectable()
export class TgRouterService {
  private readonly logger = new Logger(TgRouterService.name);
  constructor(
    private readonly privateStartCommandHandler: PrivateStartCommandHandler,
    private readonly bot: Telegraf,
    private readonly sessionGuardFactory: SessionGuardFactory,
    private readonly privateAuthTokenHandler: PrivateAuthTokenHandler,
    private readonly privateSetGamePlayersHandler: PrivateSetGamePlayersHandler,
    private readonly privateStartGameHandler: PrivateStartGameHandler,
    private readonly activeStepGuardFactory: ActiveStepGuardFactory,
  ) {}

  configure(): void {
    this.bot.use(
      logMiddleware((mes, update) =>
        this.logger.log(mes, {
          update,
        }),
      ),
    );
    const privateChat = chatTypeGuardFactory('private');
    const withSession = this.sessionGuardFactory.withSession();
    this.bot.start(runWithGuard(privateChat, this.logger, (ctx) => this.privateStartCommandHandler.handle(ctx)));
    this.bot.use(
      runWithGuard(combine(privateChat, this.sessionGuardFactory.noSession()), this.logger, (ctx) =>
        this.privateAuthTokenHandler.handle(ctx),
      ),
    );
    this.bot.command(
      'start_game',
      runWithGuard(combine(privateChat, withSession), this.logger, (ctx) => this.privateStartGameHandler.handle(ctx)),
    );
    this.bot.use(
      runWithGuard(
        combine(privateChat, withSession, this.activeStepGuardFactory.byType(PrivateSetGamePlayersHandler.STEP_NAME)),
        this.logger,
        (ctx) => this.privateSetGamePlayersHandler.handle(ctx),
      ),
    );
    this.bot.use(
      runWithGuard(combine(privateChat, withSession), this.logger, (ctx) => ctx.sendMessage('I am here with session')),
    );
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
        await ctx.sendMessage('Sorry I don`t know what to do)');
      }),
    );
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { Telegraf, Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { combine, runWithGuard } from '../../telegraf/run-with-guard.wrapper';
import { ActiveStepGuardFactory } from '../../tg-guards/active-step-guard.factory';
import { SessionGuardFactory } from '../../tg-guards/session-guard.factory';
import { getTextFromCtx } from '../tg-context.utils';
import { TgHandler } from '../tg-handlers.service';
import { PrivateGameFlowHandler } from './game-flow.handler';
import { privateChat } from './guard.constants';

@Injectable()
export class PrivateSimpleSetPlayersHandler implements TgHandler {
  static STEP_NAME = 'PrivateSimpleSetPlayersHandler';

  private readonly logger = new Logger(PrivateSimpleSetPlayersHandler.name);

  constructor(
    private readonly sessionGuardFactory: SessionGuardFactory,
    private readonly activeStepGuardFactory: ActiveStepGuardFactory,
    private readonly gameFlowHandler: PrivateGameFlowHandler,
  ) {}
  configure(bot: Telegraf<Context<Update>>): void {
    const simpleSetPlayersGuard = combine(
      privateChat,
      this.sessionGuardFactory.withSession(),
      this.activeStepGuardFactory.byType(PrivateSimpleSetPlayersHandler.STEP_NAME),
    );
    bot.use(runWithGuard(simpleSetPlayersGuard, this.logger, (ctx) => this.handleSetPlayersFlow(ctx)));
  }

  async handleSetPlayersFlow(ctx: Context): Promise<void> {
    const rawPlayersText = getTextFromCtx(ctx);
    if (rawPlayersText === null) {
      await ctx.sendMessage('Пш пш поганий зв`язок не бачу списку');
      return;
    }
    const players = rawPlayersText
      .split('\n')
      .map((it) => it.trim())
      .filter(Boolean);
    const playersMessage = players
      .map((it, ind) => `${ind + 1}: ${it}`)
      .join('\n')
      .trimEnd();
    await ctx.sendMessage(
      `
Ось кого я розпізнав:
${playersMessage}
    `.trim(),
    );
    await this.gameFlowHandler.startGame(ctx, players);
  }
}

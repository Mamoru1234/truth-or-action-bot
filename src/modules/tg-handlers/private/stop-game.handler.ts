import { Injectable, Logger } from '@nestjs/common';
import { Context, Telegraf } from 'telegraf';
import { combine, runWithGuard } from '../../telegraf/run-with-guard.wrapper';
import { SessionGuardFactory } from '../../tg-guards/session-guard.factory';
import { ActiveStepDataService } from '../active-step-data.service';
import { TgHandler } from '../tg-handlers.service';
import { privateChat } from './guard.constants';

@Injectable()
export class PrivateStopGameHandler implements TgHandler {
  private readonly logger = new Logger(PrivateStopGameHandler.name);
  constructor(
    private readonly sessionGuardFactory: SessionGuardFactory,
    private readonly activeStepDataService: ActiveStepDataService,
  ) {}

  configure(bot: Telegraf): void {
    const guard = combine(privateChat, this.sessionGuardFactory.withSession());
    bot.command(
      'stop_game',
      runWithGuard(guard, this.logger, (ctx) => this.handleStopGame(ctx)),
    );
  }

  async handleStopGame(ctx: Context): Promise<void> {
    await this.activeStepDataService.updateStepData(ctx, 'INIT', null);
    await ctx.sendMessage('Гаразд я зупинив гру✅');
    await ctx.sendMessage('Щоб почати гру ще раз надішли мені комаду /start_game.');
  }
}

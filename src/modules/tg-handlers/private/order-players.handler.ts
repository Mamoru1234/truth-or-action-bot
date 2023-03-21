import { Injectable, Logger } from '@nestjs/common';
import { shuffle } from 'lodash';
import { Context, Telegraf } from 'telegraf';
import { combine, runWithGuard } from '../../telegraf/run-with-guard.wrapper';
import { ActiveStepGuardFactory } from '../../tg-guards/active-step-guard.factory';
import { SessionGuardFactory } from '../../tg-guards/session-guard.factory';
import { ActiveStepDataService } from '../active-step-data.service';
import { getTextFromCtx } from '../tg-context.utils';
import { TgHandler } from '../tg-handlers.service';
import { PrivateGameFlowHandler } from './game-flow.handler';
import { privateChat } from './guard.constants';

const PROMPT_USER_ORDER_STEP = 'PrivateOrderPlayersHandler/PROMPT_USER_ORDER_STEP';

export interface OrderPlayersData {
  players: string[];
}

@Injectable()
export class PrivateOrderPlayersHandler implements TgHandler {
  private readonly logger = new Logger(PrivateOrderPlayersHandler.name);

  constructor(
    private readonly sessionGuardFactory: SessionGuardFactory,
    private readonly activeStepGuardFactory: ActiveStepGuardFactory,
    private readonly activeStepDataService: ActiveStepDataService,
    private readonly gameFlowHandler: PrivateGameFlowHandler,
  ) {}

  configure(bot: Telegraf): void {
    const promptUserOrderGuard = combine(
      privateChat,
      this.sessionGuardFactory.withSession(),
      this.activeStepGuardFactory.byType(PROMPT_USER_ORDER_STEP),
    );
    bot.use(runWithGuard(promptUserOrderGuard, this.logger, (ctx) => this.handlePlayersOrderPrompt(ctx)));
  }

  async startFlow(players: string[], ctx: Context): Promise<void> {
    await this.updateStepData(ctx, {
      players,
    });
    await this.sendOrderPromt(ctx, players);
  }

  private async handlePlayersOrderPrompt(ctx: Context): Promise<void> {
    const response = getTextFromCtx(ctx);
    if (!response) {
      await ctx.sendMessage('Please send yes/no');
      return;
    }
    if (!response.toLowerCase().includes('yes')) {
      await this.shiftPlayers(ctx);
      return;
    }
    const { players } = await this.activeStepDataService.getData<OrderPlayersData>(ctx);
    await this.gameFlowHandler.startGame(ctx, players);
  }

  private async shiftPlayers(ctx: Context): Promise<void> {
    const { players } = await this.activeStepDataService.getData<OrderPlayersData>(ctx);
    const newOrder = shuffle(players);
    await this.updateStepData(ctx, {
      players: newOrder,
    });
    await this.sendOrderPromt(ctx, newOrder);
  }

  private async sendOrderPromt(ctx: Context, players: string[]): Promise<void> {
    await ctx.sendMessage('Are you ok with such order?');
    const playersMessage = players
      .map((it, ind) => `${ind + 1}: ${it}`)
      .join('\n')
      .trim();
    await ctx.sendMessage(playersMessage);
  }

  private async updateStepData(ctx: Context, data: OrderPlayersData): Promise<void> {
    await this.activeStepDataService.updateStepData(ctx, PROMPT_USER_ORDER_STEP, data);
  }
}

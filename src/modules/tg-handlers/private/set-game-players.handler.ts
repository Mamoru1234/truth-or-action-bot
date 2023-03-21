import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { Repository } from 'typeorm';
import { ActiveStepEntity } from '../../db/entities/active-step.entity';
import { combine, runWithGuard } from '../../telegraf/run-with-guard.wrapper';
import { ActiveStepGuardFactory } from '../../tg-guards/active-step-guard.factory';
import { SessionGuardFactory } from '../../tg-guards/session-guard.factory';
import { ActiveStepFetcher } from '../../tg-session-data/active-step.fetcher';
import { ChatSessionFetcher } from '../../tg-session-data/chat-session.fetcher';
import { getTextFromCtx } from '../tg-context.utils';
import { TgHandler } from '../tg-handlers.service';
import { privateChat } from './guard.constants';
import { PrivateOrderPlayersHandler } from './order-players.handler';

interface SetGamePlayersData {
  approvedPlayers: string[];
  targetPlayers: string[];
}

@Injectable()
export class PrivateSetGamePlayersHandler implements TgHandler {
  static STEP_NAME = 'PrivateSetGamePlayersHandler';
  private static APPROVE_STEP_NAME = 'private/approve-game-players';
  private readonly logger = new Logger(PrivateSetGamePlayersHandler.name);

  constructor(
    private readonly sessionGuardFactory: SessionGuardFactory,
    private readonly activeStepGuardFactory: ActiveStepGuardFactory,
    @InjectRepository(ActiveStepEntity)
    private readonly activeStepRepository: Repository<ActiveStepEntity>,
    private readonly chatSessionFetcher: ChatSessionFetcher,
    private readonly activeStepFetcher: ActiveStepFetcher,
    private readonly privateOrderPlayersHandler: PrivateOrderPlayersHandler,
  ) {}

  private async handleParsePlayers(ctx: Context): Promise<void> {
    const rawPlayersText = getTextFromCtx(ctx);
    if (rawPlayersText === null) {
      await ctx.sendMessage('Пш пш поганий зв`язок не бачу списку');
      return;
    }
    const activeStep = await this.activeStepFetcher.require(ctx);
    const approvedPlayers = (activeStep.data as SetGamePlayersData)?.approvedPlayers ?? [];
    if (rawPlayersText.toLowerCase().includes('done')) {
      if (approvedPlayers.length === 0) {
        await ctx.sendMessage('No players in game');
        return;
      }
      await ctx.sendMessage('Okey we are done with players.');
      await this.privateOrderPlayersHandler.startFlow(approvedPlayers, ctx);
      return;
    }
    const players = rawPlayersText
      .split('\n')
      .map((it) => it.trim())
      .filter(Boolean);
    const newPlayers = players.filter((it) => !approvedPlayers.includes(it));
    if (players.length === 0) {
      await ctx.sendMessage('No players in message');
      return;
    }
    if (newPlayers.length === 0) {
      await ctx.sendMessage('No new players');
      return;
    }
    const session = await this.chatSessionFetcher.require(ctx);
    await this.activeStepRepository.update(
      {
        session,
      },
      {
        type: PrivateSetGamePlayersHandler.APPROVE_STEP_NAME,
        data: {
          targetPlayers: newPlayers,
          approvedPlayers,
        },
      },
    );
    const playersMessage = newPlayers
      .map((it, ind) => `${ind + 1}: ${it}`)
      .join('\n')
      .trimEnd();
    await ctx.sendMessage(
      `
Is this list of players you want to add?(yes/no)
${playersMessage}
    `.trim(),
    );
  }

  private async handleApprovePlayers(ctx: Context): Promise<void> {
    const response = getTextFromCtx(ctx);
    if (!response) {
      await ctx.sendMessage('Please send me yes/no response');
      return;
    }
    const activeStep = await this.activeStepFetcher.require(ctx);
    const data = activeStep.data as SetGamePlayersData;
    const approvedPlayers = data?.approvedPlayers ?? [];
    const targetPlayers = data?.targetPlayers ?? [];
    if (targetPlayers.length === 0) {
      throw new Error('No target players found');
    }
    if (response.toLowerCase() === 'yes') {
      approvedPlayers.push(...targetPlayers);
      await ctx.sendMessage('Ok I will approve this players, please send new players');
    } else {
      await ctx.sendMessage('I will skip this players, please send new players');
    }
    const session = await this.chatSessionFetcher.require(ctx);
    await this.activeStepRepository.update(
      {
        session,
      },
      {
        type: PrivateSetGamePlayersHandler.STEP_NAME,
        data: {
          approvedPlayers,
        },
      },
    );
  }

  configure(bot: Telegraf<Context<Update>>): void {
    bot.use(
      runWithGuard(
        combine(
          privateChat,
          this.sessionGuardFactory.withSession(),
          this.activeStepGuardFactory.byType(PrivateSetGamePlayersHandler.STEP_NAME),
        ),
        this.logger,
        (ctx) => this.handleParsePlayers(ctx),
      ),
    );
    bot.use(
      runWithGuard(
        combine(
          privateChat,
          this.sessionGuardFactory.withSession(),
          this.activeStepGuardFactory.byType(PrivateSetGamePlayersHandler.APPROVE_STEP_NAME),
        ),
        this.logger,
        (ctx) => this.handleApprovePlayers(ctx),
      ),
    );
  }
}

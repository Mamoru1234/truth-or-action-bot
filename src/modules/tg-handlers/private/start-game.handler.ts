import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Context, Telegraf } from 'telegraf';
import { Repository } from 'typeorm';
import { ActiveStepEntity } from '../../db/entities/active-step.entity';
import { combine, runWithGuard } from '../../telegraf/run-with-guard.wrapper';
import { SessionGuardFactory } from '../../tg-guards/session-guard.factory';
import { ChatSessionFetcher } from '../../tg-session-data/chat-session.fetcher';
import { TgHandler } from '../tg-handlers.service';
import { privateChat } from './guard.constants';
import { PrivateSetGamePlayersHandler } from './set-game-players.handler';

@Injectable()
export class PrivateStartGameHandler implements TgHandler {
  private readonly logger = new Logger(PrivateStartGameHandler.name);

  constructor(
    @InjectRepository(ActiveStepEntity)
    private readonly activeStepRepository: Repository<ActiveStepEntity>,
    private readonly chatSessionFetcher: ChatSessionFetcher,
    private readonly sessionGuardFactory: SessionGuardFactory,
  ) {}

  configure(bot: Telegraf): void {
    bot.command(
      'start_game',
      runWithGuard(combine(privateChat, this.sessionGuardFactory.withSession()), this.logger, (ctx) => this.handle(ctx)),
    );
  }

  async handle(ctx: Context): Promise<void> {
    const session = await this.chatSessionFetcher.getSession(ctx);
    if (!session) {
      throw new Error('No session');
    }
    this.logger.log('Start game');
    await this.activeStepRepository.update(
      {
        session,
      },
      {
        type: PrivateSetGamePlayersHandler.STEP_NAME,
      },
    );
    await ctx.sendMessage('Send me players. Send done to complete');
  }
}

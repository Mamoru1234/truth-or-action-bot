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
import { PrivateSimpleSetPlayersHandler } from './simple-set-game-players.handler';

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
    const session = await this.chatSessionFetcher.require(ctx);
    this.logger.log('Start game');
    await this.activeStepRepository.update(
      {
        session,
      },
      {
        type: PrivateSimpleSetPlayersHandler.STEP_NAME,
      },
    );
    await ctx.sendMessage(
      'Надішли мені список гравців. Кожного гравця з окремого рядку, саме в такому порядку як маєте грати.',
    );
  }
}

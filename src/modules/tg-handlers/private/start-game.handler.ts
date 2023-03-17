import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Context } from 'telegraf';
import { Repository } from 'typeorm';
import { ActiveStepEntity } from '../../db/entities/active-step.entity';
import { ChatSessionFetcher } from '../../tg-session-data/chat-session.fetcher';
import { PrivateSetGamePlayersHandler } from './set-game-players.handler';

export class PrivateStartGameHandler {
  private readonly logger = new Logger(PrivateStartGameHandler.name);

  constructor(
    @InjectRepository(ActiveStepEntity)
    private readonly activeStepRepository: Repository<ActiveStepEntity>,
    private readonly chatSessionFetcher: ChatSessionFetcher,
  ) {}

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

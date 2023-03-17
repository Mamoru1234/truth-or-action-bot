import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Context } from 'telegraf';
import { Repository } from 'typeorm';
import { ActiveStepEntity } from '../../db/entities/active-step.entity';
import { ChatSessionEntity, ChatType } from '../../db/entities/chat-session.entity';
import { getAuthToken } from './auth-token.config';

@Injectable()
export class PrivateAuthTokenHandler {
  private readonly logger = new Logger(PrivateAuthTokenHandler.name);
  private readonly correctAuthToken = getAuthToken();

  constructor(
    @InjectRepository(ChatSessionEntity)
    private readonly sessionRepository: Repository<ChatSessionEntity>,
    @InjectRepository(ActiveStepEntity)
    private readonly activeStepRepository: Repository<ActiveStepEntity>,
  ) {}

  async handle(ctx: Context): Promise<void> {
    if (!ctx.chat) {
      throw new Error('No chat in ctx');
    }
    if (!ctx.message || !('text' in ctx.message)) {
      await ctx.sendMessage('Please send me a token');
      return;
    }
    const token = ctx.message.text;
    if (token.trim() !== this.correctAuthToken) {
      await ctx.sendMessage('Please send me a token');
      return;
    }
    this.logger.log('Handling auth token');
    const [session] = await this.sessionRepository.save([
      {
        tgId: `${ctx.chat.id}`,
        type: ChatType.PRIVATE,
      },
    ]);
    await this.activeStepRepository.save([
      {
        type: 'INIT',
        session,
      },
    ]);
    await ctx.sendMessage('Ok got it. Now you can start game.');
  }
}

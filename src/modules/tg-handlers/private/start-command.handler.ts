import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Context } from 'telegraf';
import { Repository } from 'typeorm';
import { ChatSessionEntity } from '../../db/entities/chat-session.entity';

@Injectable()
export class PrivateStartCommandHandler {
  private readonly logger = new Logger(PrivateStartCommandHandler.name);
  constructor(
    @InjectRepository(ChatSessionEntity)
    private readonly sessionRepository: Repository<ChatSessionEntity>
  ) {}

  async handle(ctx: Context): Promise<void> {
    if (!ctx.chat) {
      throw new Error('No chat in ctx');
    }
    this.logger.log('calling handle');
    const tgId = `${ctx.chat.id}`;
    await this.sessionRepository.delete({
      tgId,
    });
    await ctx.sendMessage('Please send me a token');
  }
}

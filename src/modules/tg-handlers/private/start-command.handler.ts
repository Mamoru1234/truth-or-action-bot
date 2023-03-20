import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Context, Telegraf } from 'telegraf';
import { Repository } from 'typeorm';
import { ChatSessionEntity } from '../../db/entities/chat-session.entity';
import { runWithGuard } from '../../telegraf/run-with-guard.wrapper';
import { TgHandler } from '../tg-handlers.service';
import { privateChat } from './guard.constants';

@Injectable()
export class PrivateStartCommandHandler implements TgHandler {
  private readonly logger = new Logger(PrivateStartCommandHandler.name);
  constructor(
    @InjectRepository(ChatSessionEntity)
    private readonly sessionRepository: Repository<ChatSessionEntity>,
  ) {}

  configure(bot: Telegraf): void {
    bot.start(runWithGuard(privateChat, this.logger, (ctx) => this.handle(ctx)));
  }

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

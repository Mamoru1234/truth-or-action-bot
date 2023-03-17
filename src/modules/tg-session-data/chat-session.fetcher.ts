import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUndefined } from 'lodash';
import { Context } from 'telegraf';
import { Repository } from 'typeorm';
import { ChatSessionEntity } from '../db/entities/chat-session.entity';

const SESSION_KEY = Symbol.for('CHAT_SESSION_FETCHER');

@Injectable()
export class ChatSessionFetcher {
  constructor(@InjectRepository(ChatSessionEntity) private readonly chatSesssionRepository: Repository<ChatSessionEntity>) {}

  async getSession(ctx: Context): Promise<ChatSessionEntity> {
    if (!ctx.chat) {
      throw new Error('No chat in ctx');
    }
    if (isUndefined(ctx.state[SESSION_KEY])) {
      const session = await this.chatSesssionRepository.findOne({
        where: {
          tgId: `${ctx.chat.id}`,
        },
      });
      ctx.state[SESSION_KEY] = session;
    }
    return ctx.state[SESSION_KEY];
  }
}

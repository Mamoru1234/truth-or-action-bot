import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Context, Telegraf } from 'telegraf';
import { Repository } from 'typeorm';
import { ActiveStepEntity } from '../../db/entities/active-step.entity';
import { ChatSessionEntity, ChatType } from '../../db/entities/chat-session.entity';
import { combine, runWithGuard } from '../../telegraf/run-with-guard.wrapper';
import { SessionGuardFactory } from '../../tg-guards/session-guard.factory';
import { getTextFromCtx } from '../tg-context.utils';
import { TgHandler } from '../tg-handlers.service';
import { getAuthToken } from './auth-token.config';
import { privateChat } from './guard.constants';

@Injectable()
export class PrivateAuthTokenHandler implements TgHandler {
  private readonly logger = new Logger(PrivateAuthTokenHandler.name);
  private readonly correctAuthToken = getAuthToken();

  constructor(
    @InjectRepository(ChatSessionEntity)
    private readonly sessionRepository: Repository<ChatSessionEntity>,
    @InjectRepository(ActiveStepEntity)
    private readonly activeStepRepository: Repository<ActiveStepEntity>,
    private readonly sessionGuardFactory: SessionGuardFactory,
  ) {}

  configure(bot: Telegraf): void {
    bot.use(runWithGuard(combine(privateChat, this.sessionGuardFactory.noSession()), this.logger, (ctx) => this.handle(ctx)));
  }

  async handle(ctx: Context): Promise<void> {
    if (!ctx.chat) {
      throw new Error('No chat in ctx');
    }
    const token = getTextFromCtx(ctx);
    if (token === null) {
      await ctx.sendMessage('👀 Надішли будь-ласка секрет 🕵️‍♂️');
      return;
    }
    if (token.trim() !== this.correctAuthToken) {
      await ctx.sendMessage('👀 Надішли будь-ласка секрет 🕵️‍♂️');
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
    await ctx.sendMessage('Все отримав, дякую. Можемо починати гру.');
    await ctx.sendMessage('Коли будете готові надішли мені комаду /start_game.');
  }
}

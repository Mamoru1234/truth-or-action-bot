import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUndefined } from 'lodash';
import { Context } from 'telegraf';
import { Repository } from 'typeorm';
import { ActiveStepEntity } from '../db/entities/active-step.entity';
import { ChatSessionFetcher } from './chat-session.fetcher';

const ACTIVE_STEP = Symbol.for('ACTIVE_STEP');

@Injectable()
export class ActiveStepFetcher {
  constructor(
    @InjectRepository(ActiveStepEntity)
    private readonly activeStepRepository: Repository<ActiveStepEntity>,
    private readonly chatSessionFetcher: ChatSessionFetcher,
  ) {}

  async getActiveStep(ctx: Context): Promise<ActiveStepEntity | null> {
    if (!isUndefined(ctx.state[ACTIVE_STEP])) {
      return ctx.state[ACTIVE_STEP];
    }
    const session = await this.chatSessionFetcher.getSession(ctx);
    if (!session) {
      throw new Error('No session');
    }
    const step = await this.activeStepRepository.findOne({
      where: {
        session,
      },
    });
    ctx.state[ACTIVE_STEP] = step;
    return step;
  }
}

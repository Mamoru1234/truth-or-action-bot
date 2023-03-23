import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActiveStepEntity } from '../db/entities/active-step.entity';
import { ChatSessionEntity } from '../db/entities/chat-session.entity';
import { GameTaskEntity } from '../db/entities/game-task.entity';
import { TgGuardsModule } from '../tg-guards/tg-guards.module';
import { TgSessionDataModule } from '../tg-session-data/tg-session-data.module';
import { ActiveStepDataService } from './active-step-data.service';
import { privateHanders } from './private';
import { TgHandlersService } from './tg-handlers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatSessionEntity, ActiveStepEntity, GameTaskEntity]),
    TgSessionDataModule,
    TgGuardsModule,
  ],
  providers: [ActiveStepDataService, ...privateHanders, TgHandlersService],
  exports: [TgHandlersService],
})
export class TgHandlersModule {}

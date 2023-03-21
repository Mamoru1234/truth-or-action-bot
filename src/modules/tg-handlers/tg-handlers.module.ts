import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActiveStepEntity } from '../db/entities/active-step.entity';
import { ChatSessionEntity } from '../db/entities/chat-session.entity';
import { GameTaskEntity } from '../db/entities/game-task.entity';
import { TgGuardsModule } from '../tg-guards/tg-guards.module';
import { TgSessionDataModule } from '../tg-session-data/tg-session-data.module';
import { ActiveStepDataService } from './active-step-data.service';
import { privateHanders } from './private';
import { PrivateSetGamePlayersHandler } from './private/set-game-players.handler';
import { TgHandlersService } from './tg-handlers.service';

const handlers = [PrivateSetGamePlayersHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatSessionEntity, ActiveStepEntity, GameTaskEntity]),
    TgSessionDataModule,
    TgGuardsModule,
  ],
  providers: [ActiveStepDataService, ...handlers, ...privateHanders, TgHandlersService],
  exports: [...handlers, TgHandlersService],
})
export class TgHandlersModule {}

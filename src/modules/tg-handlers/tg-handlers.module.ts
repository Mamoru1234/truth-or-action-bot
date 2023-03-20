import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActiveStepEntity } from '../db/entities/active-step.entity';
import { ChatSessionEntity } from '../db/entities/chat-session.entity';
import { TgGuardsModule } from '../tg-guards/tg-guards.module';
import { TgSessionDataModule } from '../tg-session-data/tg-session-data.module';
import { privateHanders } from './private';
import { PrivateSetGamePlayersHandler } from './private/set-game-players.handler';
import { TgHandlersService } from './tg-handlers.service';

const handlers = [PrivateSetGamePlayersHandler];

@Module({
  imports: [TypeOrmModule.forFeature([ChatSessionEntity, ActiveStepEntity]), TgSessionDataModule, TgGuardsModule],
  providers: [...handlers, ...privateHanders, TgHandlersService],
  exports: [...handlers, TgHandlersService],
})
export class TgHandlersModule {}

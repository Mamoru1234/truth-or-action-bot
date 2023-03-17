import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActiveStepEntity } from '../db/entities/active-step.entity';
import { ChatSessionEntity } from '../db/entities/chat-session.entity';
import { TgSessionDataModule } from '../tg-session-data/tg-session-data.module';
import { PrivateAuthTokenHandler } from './private/auth-token.handler';
import { PrivateSetGamePlayersHandler } from './private/set-game-players.handler';
import { PrivateStartCommandHandler } from './private/start-command.handler';
import { PrivateStartGameHandler } from './private/start-game.handler';

const handlers = [PrivateStartCommandHandler, PrivateAuthTokenHandler, PrivateSetGamePlayersHandler, PrivateStartGameHandler];

@Module({
  imports: [TypeOrmModule.forFeature([ChatSessionEntity, ActiveStepEntity]), TgSessionDataModule],
  providers: [...handlers],
  exports: [...handlers],
})
export class TgHandlersModule {}

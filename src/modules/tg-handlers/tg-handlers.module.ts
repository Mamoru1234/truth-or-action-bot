import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSessionEntity } from '../db/entities/chat-session.entity';
import { PrivateAuthTokenHandler } from './private/auth-token.handler';
import { PrivateStartCommandHandler } from './private/start-command.handler';

const handlers = [PrivateStartCommandHandler, PrivateAuthTokenHandler];

@Module({
  imports: [TypeOrmModule.forFeature([ChatSessionEntity])],
  providers: [...handlers],
  exports: [...handlers],
})
export class TgHandlersModule {}

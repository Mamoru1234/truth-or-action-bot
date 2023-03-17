import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActiveStepEntity } from '../db/entities/active-step.entity';
import { ChatSessionEntity } from '../db/entities/chat-session.entity';
import { ActiveStepFetcher } from './active-step.fetcher';
import { ChatSessionFetcher } from './chat-session.fetcher';

const providersForExport = [ChatSessionFetcher, ActiveStepFetcher];

@Module({
  imports: [TypeOrmModule.forFeature([ChatSessionEntity, ActiveStepEntity])],
  providers: [...providersForExport],
  exports: providersForExport,
})
export class TgSessionDataModule {}

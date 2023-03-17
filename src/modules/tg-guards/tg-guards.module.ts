import { Module } from '@nestjs/common';
import { TgSessionDataModule } from '../tg-session-data/tg-session-data.module';
import { ActiveStepGuardFactory } from './active-step-guard.factory';
import { SessionGuardFactory } from './session-guard.factory';

const providersForExport = [SessionGuardFactory, ActiveStepGuardFactory];

@Module({
  imports: [TgSessionDataModule],
  providers: [...providersForExport],
  exports: providersForExport,
})
export class TgGuardsModule {}

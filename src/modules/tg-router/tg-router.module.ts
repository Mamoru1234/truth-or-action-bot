import { Module } from '@nestjs/common';
import { TelegrafModule } from '../telegraf/telegraf.module';
import { TgGuardsModule } from '../tg-guards/tg-guards.module';
import { TgHandlersModule } from '../tg-handlers/tg-handlers.module';
import { TgRouterService } from './tg-router.service';

@Module({
  imports: [TgHandlersModule, TgGuardsModule, TelegrafModule],
  providers: [TgRouterService],
  exports: [TgRouterService],
})
export class TgRouterModule {}

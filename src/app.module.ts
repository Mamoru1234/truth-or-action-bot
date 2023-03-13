import { Module } from '@nestjs/common';
import { TelegrafModule } from './modules/telegraf/telegraf.module';

@Module({
  imports: [TelegrafModule],
})
export class AppModule {}

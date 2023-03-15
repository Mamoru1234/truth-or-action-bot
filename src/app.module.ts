import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './modules/db/data-source';
import { TelegrafModule } from './modules/telegraf/telegraf.module';

@Module({
  imports: [TelegrafModule, TypeOrmModule.forRoot(AppDataSource.options)],
})
export class AppModule {}

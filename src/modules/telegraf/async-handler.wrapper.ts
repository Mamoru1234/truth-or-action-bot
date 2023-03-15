import { Context } from 'telegraf';
import { Logger } from 'winston';

export type NextFunction = () => Promise<void>;

export type BotHandler = (ctx: Context, next: NextFunction) => Promise<void>;

export const asyncHandlerWrapper = (handler: BotHandler, logger: Logger) =>
  (ctx: Context, next: NextFunction) =>
    handler(ctx, next).catch(e => logger.warn('error during handler execution', e));

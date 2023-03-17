import { Context } from 'telegraf';

export class PrivateSetGamePlayersHandler {
  static STEP_NAME = 'PrivateSetGamePlayersHandler';

  async handle(ctx: Context): Promise<void> {
    await ctx.sendMessage('Ok I will set this players');
    throw new Error('test');
  }
}

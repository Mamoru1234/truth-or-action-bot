import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomInt } from 'crypto';
import { Context, Telegraf } from 'telegraf';
import { In, Not, Repository } from 'typeorm';
import { GameTaskEntity, GameTaskType } from '../../db/entities/game-task.entity';
import { combine, runWithGuard } from '../../telegraf/run-with-guard.wrapper';
import { ActiveStepGuardFactory } from '../../tg-guards/active-step-guard.factory';
import { SessionGuardFactory } from '../../tg-guards/session-guard.factory';
import { ActiveStepDataService } from '../active-step-data.service';
import { getTextFromCtx } from '../tg-context.utils';
import { TgHandler } from '../tg-handlers.service';
import { privateChat } from './guard.constants';

const TASK_TYPE_PROMPT = 'private/task-type-prompt';
const RECORD_RESPONSE = 'private/record-task-response';

export interface GameAnswer {
  taskId: number;
  type: GameTaskType;
  player: string;
  done: boolean;
}

export interface SelectedTaskData {
  id: number;
  type: GameTaskType;
}

export interface GameFlowData {
  players: string[];
  currentPlayer: number;
  answers: GameAnswer[];
  selectedTask?: SelectedTaskData;
}

@Injectable()
export class PrivateGameFlowHandler implements TgHandler {
  private readonly logger = new Logger(PrivateGameFlowHandler.name);
  constructor(
    private readonly sessionGuardFactory: SessionGuardFactory,
    private readonly activeStepGuardFactory: ActiveStepGuardFactory,
    private readonly activeStepDataService: ActiveStepDataService,
    @InjectRepository(GameTaskEntity)
    private readonly gameTaskRepository: Repository<GameTaskEntity>,
  ) {}

  configure(bot: Telegraf): void {
    const taskTypePrompt = combine(
      privateChat,
      this.sessionGuardFactory.withSession(),
      this.activeStepGuardFactory.byType(TASK_TYPE_PROMPT),
    );
    bot.use(runWithGuard(taskTypePrompt, this.logger, (ctx) => this.handleTaskTypePrompt(ctx)));
    const taskResponseGuard = combine(
      privateChat,
      this.sessionGuardFactory.withSession(),
      this.activeStepGuardFactory.byType(RECORD_RESPONSE),
    );
    bot.use(runWithGuard(taskResponseGuard, this.logger, (ctx) => this.handleTaskResponse(ctx)));
  }

  async startGame(ctx: Context, players: string[]): Promise<void> {
    await ctx.sendMessage('Ok let`s start a game');
    await this.promptPlayer(ctx, {
      players,
      currentPlayer: 0,
      answers: [],
    });
  }

  private async handleTaskTypePrompt(ctx: Context): Promise<void> {
    const response = getTextFromCtx(ctx);
    if (!response) {
      await ctx.sendMessage('Дай хоч якусь відповідь)');
      return;
    }
    if (response.toLowerCase().startsWith('п')) {
      await this.promptTaskForPlayer(ctx, GameTaskType.Truth);
      return;
    }
    if (response.toLowerCase().startsWith('д')) {
      await this.promptTaskForPlayer(ctx, GameTaskType.Action);
      return;
    }
    await ctx.sendMessage('Щось таке не зрозуміле у відповідді спробуй ще раз');
  }

  private async handleTaskResponse(ctx: Context): Promise<void> {
    const response = getTextFromCtx(ctx);
    if (!response) {
      await ctx.sendMessage('Дай хоч якусь відповідь)');
      return;
    }
    const data = await this.activeStepDataService.getData<GameFlowData>(ctx);
    const player = data.players[data.currentPlayer];
    if (response.toLowerCase() === 'ок') {
      await ctx.sendMessage(`Крутяк ${player}`);
      this.recordTaskAnswer(data, true);
      await this.handleNextPlayer(ctx, data);
      return;
    }
    if (response.toLowerCase() === 'пас') {
      if (!this.verifySkipCount(data)) {
        await ctx.sendMessage('Нажаль вже не можна пропустити завдання. Дуже сумно(ні)');
        return;
      }
      await ctx.sendMessage(`Ну принаймні було весело ${player}`);
      this.recordTaskAnswer(data, false);
      await this.handleNextPlayer(ctx, data);
      return;
    }
    await ctx.sendMessage('Task repsponse failed');
  }

  private recordTaskAnswer(data: GameFlowData, done: boolean): void {
    const selectedTask = data.selectedTask;
    if (!selectedTask) {
      throw new Error('No task selected');
    }
    const player = data.players[data.currentPlayer];
    data.answers.push({
      player,
      taskId: selectedTask.id,
      done,
      type: selectedTask.type,
    });
  }

  private async handleNextPlayer(ctx: Context, data: GameFlowData): Promise<void> {
    const nextPlayerInd = (data.currentPlayer + 1) % data.players.length;
    delete data.selectedTask;
    data.currentPlayer = nextPlayerInd;
    const player = data.players[data.currentPlayer];
    const lastAnswers = data.answers.filter((it) => it.player === player).slice(-2);
    if (lastAnswers.length !== 2) {
      await this.promptPlayer(ctx, data);
      return;
    }
    if (lastAnswers[0].type !== lastAnswers[1].type) {
      await this.promptPlayer(ctx, data);
      return;
    }
    const taskType = lastAnswers[0].type === GameTaskType.Action ? GameTaskType.Truth : GameTaskType.Action;
    await ctx.sendMessage('Упс в когось немає вибору.');
    await this.promptTaskForPlayer(ctx, taskType);
  }

  private async promptTaskForPlayer(ctx: Context, taskType: GameTaskType): Promise<void> {
    const task = await this.chooseTaskForPlayer(ctx, taskType);
    const data = await this.activeStepDataService.getData<GameFlowData>(ctx);
    const player = data.players[data.currentPlayer];
    const typeMessage = taskType == GameTaskType.Action ? 'Дія' : 'Питання';
    await ctx.sendMessage(
      `
${typeMessage} для ${player}:
${task.text}`.trim(),
    );
    await this.activeStepDataService.updateStepData(ctx, RECORD_RESPONSE, {
      ...data,
      selectedTask: {
        id: task.id,
        type: task.type,
      },
    });
  }

  private async chooseTaskForPlayer(ctx: Context, taskType: GameTaskType): Promise<GameTaskEntity> {
    const data = await this.activeStepDataService.getData<GameFlowData>(ctx);
    const tasksUsed = data.answers.filter((it) => it.type === taskType).map((it) => it.taskId);
    const tasksAvailable = await this.gameTaskRepository.find({
      where: {
        id: Not(In(tasksUsed)),
        type: taskType,
      },
      select: ['id'],
    });
    const taskIds = tasksAvailable.map((it) => it.id);
    const indx = randomInt(taskIds.length);
    return this.gameTaskRepository.findOneOrFail({
      where: {
        id: taskIds[indx],
      },
    });
  }

  private async promptPlayer(ctx: Context, data: GameFlowData): Promise<void> {
    const player = data.players[data.currentPlayer];
    await ctx.sendMessage(`${player} Що вибираєш праду чи дію?`);
    await this.activeStepDataService.updateStepData(ctx, TASK_TYPE_PROMPT, data);
  }

  private verifySkipCount(data: GameFlowData): boolean {
    const player = data.players[data.currentPlayer];
    const skipCount = data.answers.filter((it) => it.player === player && !it.done).length;
    return skipCount !== 2;
  }
}

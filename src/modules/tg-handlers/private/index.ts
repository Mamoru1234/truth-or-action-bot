import { PrivateAuthTokenHandler } from './auth-token.handler';
import { PrivateGameFlowHandler } from './game-flow.handler';
import { PrivateOrderPlayersHandler } from './order-players.handler';
import { PrivateSetGamePlayersHandler } from './set-game-players.handler';
import { PrivateSimpleSetPlayersHandler } from './simple-set-game-players.handler';
import { PrivateStartCommandHandler } from './start-command.handler';
import { PrivateStartGameHandler } from './start-game.handler';
import { PrivateStopGameHandler } from './stop-game.handler';

export const privateHanders = [
  PrivateStartCommandHandler,
  PrivateAuthTokenHandler,
  PrivateStartGameHandler,
  PrivateStopGameHandler,
  PrivateSimpleSetPlayersHandler,
  PrivateSetGamePlayersHandler,
  PrivateOrderPlayersHandler,
  PrivateGameFlowHandler,
];

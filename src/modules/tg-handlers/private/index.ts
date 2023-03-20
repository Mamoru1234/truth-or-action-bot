import { PrivateAuthTokenHandler } from './auth-token.handler';
import { PrivateSetGamePlayersHandler } from './set-game-players.handler';
import { PrivateStartCommandHandler } from './start-command.handler';
import { PrivateStartGameHandler } from './start-game.handler';

export const privateHanders = [
  PrivateStartCommandHandler,
  PrivateAuthTokenHandler,
  PrivateStartGameHandler,
  PrivateSetGamePlayersHandler,
];

import { cleanEnv, str } from 'envalid';
import { once } from 'lodash';

export const getAuthToken = once(() => {
  const env = cleanEnv(process.env, {
    APP_AUTH_TOKEN: str({}),
  });
  return env.APP_AUTH_TOKEN;
});

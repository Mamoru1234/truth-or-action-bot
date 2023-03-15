import { Update } from 'telegraf/typings/core/types/typegram';

export const chatTypePredicate = (chatType: string) => (update: Update) => {
  if (!('message' in update)) return false;
  return update.message.chat.type === chatType;
};

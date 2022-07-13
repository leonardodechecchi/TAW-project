import { HydratedDocument, Model, model, Types, Schema, SchemaTypes } from 'mongoose';
import { Message, messageSchema } from './Message';

/**
 * Interface that represents a chat within the database.
 */
export interface Chat {
  readonly _id: Types.ObjectId;
  users: string[];
  messages: Message[];
}

interface ChatProps {
  messages: Types.DocumentArray<Message>;

  /**
   * @param {string} username
   */
  adduser: (username: string) => Promise<ChatDocument>;

  /**
   * @param {string} username
   */
  removeUser: (username: string) => Promise<ChatDocument>;

  /**
   * @param {Message} message
   */
  addMessage: (message: Message) => Promise<ChatDocument>;
}

export interface ChatDocument extends HydratedDocument<Chat, ChatProps> {}

const chatSchema: Schema = new Schema<Chat, Model<Chat, {}, ChatProps>>({
  users: {
    type: [SchemaTypes.String],
    required: true,
  },
  messages: {
    type: [messageSchema],
  },
});

chatSchema.method(
  'addUser',
  function (this: ChatDocument, username: string): Promise<ChatDocument> {
    for (let user of this.users) {
      if (user === username) return Promise.reject(new Error('User already in the chat'));
    }
    this.users.push(username);
    return this.save();
  }
);

chatSchema.method(
  'removeUser',
  function (this: ChatDocument, username: string): Promise<ChatDocument> {
    for (let idx in this.users) {
      if (this.users[idx] === username) {
        this.users.splice(parseInt(idx), 1);
        return this.save();
      }
    }
    return Promise.reject(new Error('User not present in the chat'));
  }
);

chatSchema.method(
  'addMessage',
  function (this: ChatDocument, message: Message): Promise<ChatDocument> {
    this.messages.push(message);
    return this.save();
  }
);

export const ChatModel = model<Chat, Model<Chat, {}, ChatProps>>('Chat', chatSchema);

/**
 * Create a new chat with the given users.
 * @param {string[]} users the list of user usernames
 * @returns a Promise of `ChatDocument`, i.e. the new chat
 * @memberof Chat
 */
export async function createChat(users: string[]): Promise<ChatDocument> {
  return ChatModel.create({ users });
}

/**
 * Return the chat that match the given chat id.
 * Return an error if the chat does not exists.
 * @param chatId the chat id
 * @returns a Promise of `ChatDocument`, i.e. the chat found
 * @memberof Chat
 */
export async function getChatById(chatId: Types.ObjectId): Promise<ChatDocument> {
  const chat = await ChatModel.findOne({ _id: chatId }).exec();
  if (!chat) return Promise.reject(new Error('Chat not found'));
  return Promise.resolve(chat);
}

/**
 * Delete the chat.
 * Return an error if the chat does not exists.
 * @param chatId the chat id
 * @memberof Chat
 */
export async function deleteChatById(chatId: Types.ObjectId): Promise<void> {
  const chat = await ChatModel.findOneAndDelete({ _id: chatId }).exec();
  if (!chat) return Promise.reject(new Error('Chat not found'));
  return Promise.resolve();
}

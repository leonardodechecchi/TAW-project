import { HydratedDocument, Model, model, Types, Schema, SchemaTypes } from 'mongoose';
import { StatusError } from './StatusError';
import { UserStats, userStatsSchema } from './UserStats';
import { Relationship, relationshipSchema } from './Relationship';
import { Notification, notificationSchema, NotificationType } from './Notification';
import { ChatDocument, createChat, deleteChatById } from './Chat';
import bcrypt from 'bcrypt';

/**
 * Enum that defines all the possible roles that a user can have.
 */
export enum UserRoles {
  Admin = 'Admin',
  Moderator = 'Moderator',
  Standard = 'Standard',
}

/**
 * Enum that represents the current status of the user (Active or Pending)
 */
export enum UserStatus {
  Pending = 'Pending',
  Active = 'Active',
}

/**
 * Interface that represents a user within the database.
 */
export interface User {
  readonly _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  status: UserStatus;
  roles: string[];
  online: boolean;
  stats: UserStats;
  relationships: Relationship[];
  notifications: Notification[];
}

interface UserProps {
  relationships: Types.DocumentArray<Relationship>;
  notifications: Types.DocumentArray<Notification>;

  /**
   * Set a new encrypted password to current user.
   * @param {string} password the password to use
   */
  setPassword: (password: string) => Promise<UserDocument>;

  /**
   * Perform a validation check between the given password and the one stored in the database.
   * @param {string} password the password to check
   */
  validatePassword: (password: string) => Promise<boolean>;

  /**
   * Set the user status.
   * @param status the status
   */
  setStatus: (status: UserStatus) => Promise<UserDocument>;

  /**
   * Assign the role to the user.
   * If the user already has the role, nothing happens.
   * @param {UserRoles} role the role to set
   */
  setRole: (role: UserRoles) => Promise<UserDocument>;

  /**
   * Remove a role previously assigned to the user.
   * If the user does not have the role, nothing happens.
   * @param {UserRoles} role the role to remove
   */
  removeRole: (role: UserRoles) => Promise<UserDocument>;

  /**
   * Check if the user has a specific role.
   * @param {UserRoles} role the role to check
   */
  hasRole: (role: UserRoles) => boolean;

  /**
   * Check if the user has the Admin role.
   */
  isAdmin: () => boolean;

  /**
   * Check if the user has the Moderator role.
   */
  isModerator: () => boolean;

  /**
   * Set the user online status.
   * @param {boolean} isOnline the online status that must be true or false
   */
  setOnlineStatus: (isOnline: boolean) => Promise<UserDocument>;

  /**
   * Update the user statistics.
   * @param stats the new stats
   */
  updateStats: (stats: UserStats) => Promise<UserDocument>;

  /**
   * Create a symmetrical relationship between the user and the one given in input.
   * Return an error if the given friend id does not exists.
   * @param {Types.ObjectId} friendId the friend id
   */
  addRelationship: (friendId: Types.ObjectId) => Promise<UserDocument>;

  /**
   * Delete the relationship for both users.
   * Return an error if the given friend id does not exists.
   * Return an error if the relationship does not exists.
   * @param {Types.ObjectId} friendId the friend id
   */
  deleteRelationship: (friendId: Types.ObjectId) => Promise<UserDocument>;

  /**
   * Add a notification to current user.
   * @param {Types.ObjectId} senderId the id of the user who sent the notification
   * @param {NotificationType} type the notification type
   */
  addNotification: (senderId: Types.ObjectId, type: NotificationType) => Promise<UserDocument>;

  /**
   * Delete the notification that match the sender id and the notification type.
   * Return an error if the notification does not exists.
   * @param {Types.ObjectId} senderId the id of the user who sent the notification
   * @param {NotificationType} type the notification type
   */
  deleteNotification: (senderId: Types.ObjectId, type: NotificationType) => Promise<UserDocument>;
}

export interface UserDocument extends HydratedDocument<User, UserProps> {}

export type UserRelationships = Relationship[] & Types.DocumentArray<Relationship>;

export type UserNotifications = Notification[] & Types.DocumentArray<Notification>;

const userSchema = new Schema<User, Model<User, {}, UserProps>>({
  username: {
    type: SchemaTypes.String,
    required: true,
    unique: true,
  },
  email: {
    type: SchemaTypes.String,
  },
  password: {
    type: SchemaTypes.String,
    required: true,
  },
  status: {
    type: SchemaTypes.String,
    enum: UserStatus,
    default: UserStatus.Pending,
  },
  roles: {
    type: [SchemaTypes.String],
    required: true,
    enum: UserRoles,
  },
  online: {
    type: SchemaTypes.Boolean,
    default: false,
  },
  stats: {
    type: userStatsSchema,
    default: () => ({}),
  },
  relationships: {
    type: [relationshipSchema],
  },
  notifications: {
    type: [notificationSchema],
  },
});

userSchema.method(
  'setPassword',
  async function (this: UserDocument, password: string): Promise<UserDocument> {
    const salt: string = await bcrypt.genSalt(10);
    const hash: string = await bcrypt.hash(password, salt);
    this.password = hash;
    return this.save();
  }
);

userSchema.method(
  'validatePassword',
  async function (this: UserDocument, password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
);

userSchema.method(
  'setStatus',
  async function (this: UserDocument, status: UserStatus): Promise<UserDocument> {
    this.status = status;
    return this.save();
  }
);

userSchema.method(
  'setRole',
  async function (this: UserDocument, role: UserRoles): Promise<UserDocument> {
    if (!this.hasRole(role)) {
      this.roles.push(role);
      return this.save();
    }
    return Promise.reject(new StatusError(400, 'Role already set'));
  }
);

userSchema.method(
  'removeRole',
  async function (this: UserDocument, role: UserRoles): Promise<UserDocument> {
    for (let idx in this.roles) {
      if (this.roles[idx] === role) {
        this.roles.splice(parseInt(idx), 1);
        return this.save();
      }
    }
    return Promise.reject(new StatusError(400, 'Role not found'));
  }
);

userSchema.method('hasRole', function (this: UserDocument, role: UserRoles): boolean {
  for (let idx in this.roles) {
    if (this.roles[idx] === role) return true;
  }
  return false;
});

userSchema.method('isAdmin', function (this: UserDocument): boolean {
  return this.roles.includes(UserRoles.Admin);
});

userSchema.method('isModerator', function (this: UserDocument): boolean {
  return this.roles.includes(UserRoles.Moderator);
});

userSchema.method(
  'setOnlineStatus',
  async function (this: UserDocument, isOnline: boolean): Promise<UserDocument> {
    this.online = isOnline;
    return this.save();
  }
);

userSchema.method(
  'updateStats',
  async function (this: UserDocument, stats: UserStats): Promise<UserDocument> {
    this.stats = stats;
    return this.save();
  }
);

userSchema.method(
  'addRelationship',
  async function (this: UserDocument, friendId: Types.ObjectId): Promise<UserDocument> {
    const friend = await getUserById(friendId);
    friend.relationships.push({ friendId: this._id });
    this.relationships.push({ friendId });
    await friend.save();
    return this.save();
  }
);

userSchema.method(
  'deleteRelationship',
  async function (this: UserDocument, friendId: Types.ObjectId): Promise<UserDocument> {
    const friend = await getUserById(friendId);
    await deleteUserRelationship(friend, this);
    return deleteUserRelationship(this, friend);
  }
);

userSchema.method(
  'addNotification',
  async function (
    this: UserDocument,
    senderId: Types.ObjectId,
    type: NotificationType
  ): Promise<UserDocument> {
    for (let notification of this.notifications) {
      if (notification.senderId.equals(senderId) && notification.type === type) {
        return Promise.reject(new StatusError(400, 'Notification already sent'));
      }
    }
    this.notifications.push({ senderId, type });
    return this.save();
  }
);

userSchema.method(
  'deleteNotification',
  async function (
    this: UserDocument,
    senderId: Types.ObjectId,
    type: NotificationType
  ): Promise<UserDocument> {
    // TODO check senderId and notification type (?)
    this.notifications.pull({ senderId, type });
    return this.save();
  }
);

export const UserModel = model<User, Model<User, {}, UserProps>>('User', userSchema);

/**
 * Create a standard user with the given information.
 * @param data the user email, username, password
 * @returns a Promise of `UserDocument`, i.e. the new user
 */
export async function createUser(data: {
  email?: string;
  username: string;
  password: string;
}): Promise<UserDocument> {
  const user = new UserModel({ email: data.email, username: data.username });
  await user.setPassword(data.password);
  await user.setRole(UserRoles.Standard);
  return Promise.resolve(user);
}

/**
 * Find and delete the user.
 * Return an error if the user does not exists.
 * @param userId the user id
 * @returns an empty Promise
 */
export async function deleteUserById(userId: Types.ObjectId): Promise<void> {
  const user = await UserModel.findOneAndDelete({ _id: userId }).exec();
  if (!user) {
    return Promise.reject(new StatusError(404, `User not found`));
  }
}

/**
 * Return the user who match the given user id.
 * Return an error if the user does not exists.
 * @param userId the user id
 * @returns a Promise of `UserDocument`, i.e. the user found
 */
export async function getUserById(userId: Types.ObjectId): Promise<UserDocument> {
  const user = await UserModel.findOne({ _id: userId }).exec();
  if (!user) {
    return Promise.reject(new StatusError(404, 'User not found'));
  }
  return Promise.resolve(user);
}

/**
 * Return the user who match the given username.
 * Return an error if the user does not exists.
 * @param username the user username
 * @returns a Promise of `UserDocument`, i.e. the user found
 */
export async function getUserByUsername(username: string): Promise<UserDocument> {
  const user = await UserModel.findOne({ username }).exec();
  if (!user) {
    return Promise.reject(new StatusError(404, `User not found`));
  }
  return Promise.resolve(user);
}

/**
 * Return the user who match the given email.
 * Return an error if the user does not exists.
 * @param email the user email
 * @returns a Promise of `UserDocument`, i.e. the user found
 */
export async function getUserByEmail(email: string): Promise<UserDocument> {
  const user = await UserModel.findOne({ email }).exec();
  if (!user) {
    return Promise.reject(new StatusError(404, `User not found`));
  }
  return Promise.resolve(user);
}

/**
 * Return the list of the user relationships.
 * @param userId the user id
 * @returns an array of `Relationship`, i.e. the user relationships
 */
export async function getUserRelationships(userId: Types.ObjectId): Promise<UserRelationships> {
  const user = await UserModel.findOne({ _id: userId })
    .populate('relationships.friendId', 'username online stats')
    .exec();
  if (!user) {
    return Promise.reject(new StatusError(404, `User not found`));
  }
  return Promise.resolve(user.relationships);
}

/**
 * Auxiliary function.
 * Delete the relationship between the user and the given friend id.
 * Return an error if the relationship does not exists.
 * @param user the user record
 * @param friendId the friend id
 * @returns a Promise of `UserDocument`, i.e. the user record updated
 */
async function deleteUserRelationship(
  user: UserDocument,
  friend: UserDocument
): Promise<UserDocument> {
  for (let idx in user.relationships) {
    let relationship = user.relationships[idx];
    if (relationship.friendId.equals(friend._id)) {
      if (relationship.chatId) {
        await deleteChatById(relationship.chatId);
        for (let idx in friend.relationships) {
          if (friend.relationships[idx].friendId.equals(user._id)) {
            friend.relationships[idx].chatId = undefined;
            await friend.save();
          }
        }
      }
      user.relationships.splice(parseInt(idx), 1);
      return user.save();
    }
  }
  return Promise.reject(new StatusError(404, `Relationship not found`));
}

/**
 * Auxiliary function.
 * Add the `chatId` to the relationship between `user` and the `friendId` given in input.
 * Return an error if the relationship does not exists and delete the chat.
 * @param user the user record
 * @param friendId the friend id
 * @param chatId the chat id
 * @returns a Promise of `UserDocument`, i.e. the user record updated
 */
async function addChatIdToRelationship(
  user: UserDocument,
  friendId: Types.ObjectId,
  chatId: Types.ObjectId
): Promise<UserDocument> {
  for (let idx in user.relationships) {
    let relationship = user.relationships[idx];
    if (relationship.friendId.equals(friendId)) {
      if (relationship.chatId) {
        await deleteChatById(chatId);
        return Promise.reject(new StatusError(400, `Chat already exists`));
      }
      relationship.chatId = chatId;
      return user.save();
    }
  }
  await deleteChatById(chatId);
  return Promise.reject(new StatusError(404, `Relationship not found`));
}

/**
 * Create a chat for the relationship between `user` and `friend`.
 * @param user the user record
 * @param friend the friend record
 * @returns a Promise of `ChatDocument`, i.e. the chat created
 */
export async function createRelationshipChat(
  user: UserDocument,
  friend: UserDocument
): Promise<ChatDocument> {
  const chat: ChatDocument = await createChat([user.username, friend.username]);
  await addChatIdToRelationship(friend, user._id, chat._id);
  await addChatIdToRelationship(user, friend._id, chat._id);
  return Promise.resolve(chat);
}

/**
 * Return the list of the user notifications.
 * @param userId the user id
 * @returns an array of `Notification`, i.e. the user notifications
 */
export async function getUserNotifications(userId: Types.ObjectId): Promise<UserNotifications> {
  const user = await UserModel.findOne({ _id: userId })
    .populate('notifications.senderId', 'username')
    .exec();
  if (!user) {
    return Promise.reject(new StatusError(404, `User not found`));
  }
  return Promise.resolve(user.notifications);
}

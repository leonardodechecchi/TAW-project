import { HydratedDocument, model, Schema, SchemaTypes, Types } from 'mongoose';

/**
 * Interface that represents an email token within the database.
 */
interface EmailToken {
  userId: Types.ObjectId;
  token: string;
}

export interface EmailTokenDocument extends HydratedDocument<EmailToken> {}

const emailTokenSchema = new Schema<EmailToken>({
  userId: {
    type: SchemaTypes.ObjectId,
    required: true,
  },
  token: {
    type: SchemaTypes.String,
    required: true,
  },
});

export const EmailTokenModel = model<EmailToken>('EmailToken', emailTokenSchema);

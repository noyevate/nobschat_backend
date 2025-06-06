import mongoose, { Document, Schema } from 'mongoose';

interface IMessage extends Document {
  conversation_id?: string;
  sender_id?: string;
  content: string;
}

const MessageSchema: Schema<IMessage> = new mongoose.Schema(
  {
    conversation_id: { type: String, required: false },
    sender_id: { type: String, required: false, },
    content: { type: String, required: true },
  },
  {
    toJSON: {
      transform(_doc: any, ret: any) {
        delete ret.__v;
        return ret;
      },
    },
    timestamps: true,
  }
);

export const Message = mongoose.model<IMessage>('Message', MessageSchema);

import mongoose, { Document, Schema } from 'mongoose';

interface IConversation extends Document {
  participant_one: string;
  participant_two: string;
}

const ConversationSchema: Schema<IConversation> = new mongoose.Schema(
  {
    participant_one: { type: String, required: false },
    participant_two: { type: String, required: false },
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

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);



import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  username?: string;
  password?: string;
  email: string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    username: { type: String, required: false },
    password: { type: String, required: false, default: 'non' },
    email: { type: String, required: true },
  },
  {
    toJSON: {
      transform(_doc: any, ret: any) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);

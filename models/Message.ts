import mongoose, { Schema, Model, Document } from "mongoose";

export interface IMessage extends Document {
  room: string;
  sender: "admin" | "user";
  text: string;
  createdAt: Date;
  updatedAt: Date;
  read: boolean;
}

const MessageSchema = new Schema<IMessage>(
  {
    room: { type: String, required: true },
    sender: { type: String, required: true, enum: ["admin", "user"] },
    text: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default Message;

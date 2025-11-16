import mongoose, { Schema, Document, Model } from "mongoose";

export interface INote extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  tags?: string[];
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema<INote> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Note: Model<INote> =
  mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema);

export default Note;

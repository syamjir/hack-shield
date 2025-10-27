import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface IPassword extends Document {
  userId: mongoose.Types.ObjectId;
  site: string;
  username: string;
  password: string;
  strength: "Weak" | "Medium" | "Strong";
  websiteUri?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PasswordSchema: Schema<IPassword> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    site: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    strength: {
      type: String,
      enum: ["Weak", "Medium", "Strong"],
      required: true,
    },
    websiteUri: {
      type: String,
    },
  },
  { timestamps: true }
);

// hash password before save
PasswordSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(
    this.password,
    Number(process.env.BCRYPT_SALT_ROUNDS)
  );
  next();
});

const Password: Model<IPassword> =
  mongoose.models.Password ||
  mongoose.model<IPassword>("Password", PasswordSchema);

export default Password;

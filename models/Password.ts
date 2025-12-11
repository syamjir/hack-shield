import mongoose, { Schema, Document, Model } from "mongoose";
import { CryptoService } from "@/lib/CryptoService";

export interface IPassword extends Document {
  userId: mongoose.Types.ObjectId;
  site: string;
  username: string;
  password: string;
  iv?: string;
  strength: "Weak" | "Medium" | "Strong";
  websiteUri?: string;
  isDeleted: boolean;
  isBreached: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): boolean;
  decryptPassword(password: string): string;
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
      select: false,
    },
    iv: {
      type: String,
    },
    strength: {
      type: String,
      enum: ["Weak", "Medium", "Strong"],
      required: true,
    },
    websiteUri: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isBreached: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// hash password before save
PasswordSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  const { encrypted, iv } = CryptoService.encrypt(this.password);
  console.log(iv);
  this.password = encrypted;
  this.iv = iv;
  next();
});

// 🔐 Compare password for check same login credentials
PasswordSchema.methods.comparePassword = function (password: string): boolean {
  return CryptoService.compareData(password, this.password, this.iv);
};

// Decrypted password
PasswordSchema.methods.decryptPassword = function (password: string): string {
  if (!this.iv) throw new Error("IV is missing");
  return CryptoService.decrypt(password, this.iv);
};

const Password: Model<IPassword> =
  mongoose.models.Password ||
  mongoose.model<IPassword>("Password", PasswordSchema);

export default Password;

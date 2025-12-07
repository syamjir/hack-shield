import mongoose, { Schema, Document, Model, Query } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

export interface IUser extends Document {
  name?: string;
  _id: string;
  email: string;
  password: string;
  phone: string;
  twoFactorMethod: "email" | "phone";
  twoFactorVerified: boolean;
  verificationCode?: string;
  verificationExpires?: Date;
  role: "User" | "Admin";
  preference: { theme: string; auto_lock: boolean; emailNotification: boolean };
  payment: {
    isPremiumUser: boolean;
    orderId?: string;
    paymentStatus: "PENDING" | "SUCCESS" | "FAILED";
  };
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(password: string): Promise<boolean>;
  createVerificationCode(): string;
  verifyVerificationCode(inputCode: string): boolean;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      required: true,
      minLength: 6,
    },
    twoFactorMethod: {
      type: String,
      enum: ["email", "phone"],
      required: true,
    },
    twoFactorVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
    },
    verificationExpires: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
    preference: {
      theme: { type: String, enum: ["dark", "light"], default: "dark" },
      auto_lock: { type: Boolean, default: false },
      emailNotification: {
        type: Boolean,
        default: true,
      },
    },
    payment: {
      isPremiumUser: { type: Boolean, default: false },
      orderId: { type: String }, // Razorpay order ID
      paymentStatus: {
        type: String,
        enum: ["PENDING", "SUCCESS", "FAILED"],
        default: "PENDING",
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 🔒 Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(
    this.password,
    Number(process.env.BCRYPT_SALT_ROUNDS)
  );
  next();
});

UserSchema.pre(/^find/, function (this: Query<any, any>, next) {
  this.where({ isDeleted: false });
  next();
});

// 🔐 Compare password for login
UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// 🧩 Create Verification Code
UserSchema.methods.createVerificationCode = function (): string {
  // Generate new 6-digit code and replace existing one
  const verificationCode = crypto.randomInt(100000, 999999).toString();
  this.verificationCode = verificationCode;
  this.verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // code expires in 10 minute
  return verificationCode;
};
// ✅ Verify user-provided code
UserSchema.methods.verifyVerificationCode = function (
  inputCode: string
): boolean {
  const isValid =
    this.verificationCode === inputCode &&
    this.verificationExpires &&
    this.verificationExpires > new Date();
  return isValid;
};
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

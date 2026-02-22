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
  preference: {
    theme: string;
    auto_lock: boolean;
    emailNotification: boolean;
  };
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

    // Hashed password (hidden by default)
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

    verificationCode: String,
    verificationExpires: Date,

    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },

    preference: {
      theme: {
        type: String,
        enum: ["dark", "light"],
        default: "dark",
      },
      auto_lock: {
        type: Boolean,
        default: false,
      },
      emailNotification: {
        type: Boolean,
        default: true,
      },
    },

    payment: {
      isPremiumUser: {
        type: Boolean,
        default: false,
      },
      orderId: String,
      paymentStatus: {
        type: String,
        enum: ["PENDING", "SUCCESS", "FAILED"],
        default: "PENDING",
      },
    },

    // Soft delete flag
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // Adds createdAt & updatedAt
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(
    this.password,
    Number(process.env.BCRYPT_SALT_ROUNDS)
  );

  next();
});

// Exclude soft-deleted users from queries
UserSchema.pre(/^find/, function (this: Query<any, any>, next) {
  this.where({ isDeleted: false });
  next();
});

// Compare hashed password
UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Generate 6-digit verification code (valid for 10 minutes)
UserSchema.methods.createVerificationCode = function (): string {
  const verificationCode = crypto.randomInt(100000, 999999).toString();

  this.verificationCode = verificationCode;
  this.verificationExpires = new Date(Date.now() + 10 * 60 * 1000);

  return verificationCode;
};

// Validate verification code
UserSchema.methods.verifyVerificationCode = function (
  inputCode: string
): boolean {
  return (
    this.verificationCode === inputCode &&
    this.verificationExpires &&
    this.verificationExpires > new Date()
  );
};

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
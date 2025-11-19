import { CryptoService } from "@/lib/CryptoService";
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICard extends Document {
  userId: mongoose.Types.ObjectId;
  cardHolder: string;
  bank: string;
  cardNumber: string;
  lastFour: string;
  brand?: string; // Visa, MasterCard, etc.
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  isDeleted: boolean;
  ivCard?: string;
  ivCvv?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  compareCard(cardNumber: string): boolean;
  getDecryptedCardNumber(): string;
  getDecryptedCVV(): string;
}

const CardSchema: Schema<ICard> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bank: {
      type: String,
      required: true,
      trim: true,
    },
    cardHolder: {
      type: String,
      required: true,
      trim: true,
    },
    cardNumber: {
      type: String,
      required: true,
      trim: true,
      minlength: 12,
      maxlength: 19,
      select: false,
    },
    lastFour: {
      type: String,
      trim: true,
      minlength: 4,
      maxlength: 4,
    },
    brand: {
      type: String,
      trim: true,
    },
    expiryMonth: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    expiryYear: {
      type: Number,
      required: true,
    },
    cvv: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 4,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    ivCard: {
      type: String,
    },
    ivCvv: {
      type: String,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// hash card number and cvv before save
CardSchema.pre("save", function (next) {
  if (this.isModified("cardNumber")) {
    // save lastFour 1st
    this.lastFour = this.cardNumber.slice(-4);
    // encrypt card number
    const { encrypted, iv } = CryptoService.encrypt(this.cardNumber);
    this.cardNumber = encrypted;
    this.ivCard = iv;
  }
  if (this.isModified("cvv")) {
    const { encrypted, iv } = CryptoService.encrypt(this.cvv);
    this.cvv = encrypted;
    this.ivCvv = iv;
  }
  next();
});

// Decrypt methods
CardSchema.methods.getDecryptedCardNumber = function (): string {
  if (!this.ivCard) throw new Error("IV is missing");
  return CryptoService.decrypt(this.cardNumber, this.ivCard);
};

CardSchema.methods.getDecryptedCVV = function (): string {
  if (!this.ivCvv) throw new Error("IV is missing");
  return CryptoService.decrypt(this.cvv, this.ivCvv);
};

// 🔐 Compare cardNumber for check same card credentials
CardSchema.methods.compareCard = function (cardNumber: string): boolean {
  return CryptoService.compareData(cardNumber, this.cardNumber, this.ivCard);
};

const Card: Model<ICard> =
  mongoose.models.Card || mongoose.model<ICard>("Card", CardSchema);

export default Card;

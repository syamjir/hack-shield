"use server";

import { whoAmI } from "@/app/dashboard/settings/settingServerActions";
import User from "@/models/User";
import { cookies } from "next/headers";
import Razorpay from "razorpay";
import { connectToMongo } from "@/lib/connectToMongo";

export async function createOrder(amount: number) {
  // Ensure MongoDB connection before DB operations
  await connectToMongo();

  // Validate amount against server-side premium price
  const PREMIUM_AMOUNT = Number(process.env.PREMIUM_AMOUNT);
  if (PREMIUM_AMOUNT !== amount) {
    throw new Error("Incorrect premium amount");
  }

  // Initialize Razorpay client using secret keys
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_TEST_KEY_ID!,
    key_secret: process.env.RAZORPAY_TEST_KEY_SECRET!,
  });

  // Create a Razorpay order (amount in paise)
  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });

  // Identify logged-in user via JWT cookie
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;

  if (!jwt) throw new Error("Unauthorized. Please log in first");

  const { data: loggedUser } = await whoAmI(jwt);
  if (!loggedUser) throw new Error("User not found");

  // Prevent order creation if user already has premium access
  if (loggedUser.payment.isPremiumUser) {
    return {
      order: null,
      userEmail: loggedUser.email,
      userPhone: loggedUser.phone,
      alreadyPremium: true,
    };
  }

  // Persist Razorpay orderId and mark payment as pending
  const user = await User.findByIdAndUpdate(
    loggedUser._id,
    {
      $set: {
        "payment.orderId": order.id,
        "payment.paymentStatus": "PENDING",
      },
    },
    { new: true }
  ).lean();

  // Return order details and user contact info to client
  return {
    order,
    userEmail: user?.email,
    userPhone: user?.phone,
    alreadyPremium: false,
  };
}

"use server";

import { whoAmI } from "@/app/dashboard/settings/settingServerActions";
import User from "@/models/User";
import { cookies } from "next/headers";
import Razorpay from "razorpay";
import { connectToMongo } from "@/lib/connectToMongo";

export async function createOrder(amount: number) {
  await connectToMongo();

  const PREMIUM_AMOUNT = Number(process.env.PREMIUM_AMOUNT);
  if (PREMIUM_AMOUNT !== amount) {
    throw new Error("Incorrect premium amount");
  }

  // 1. Init Razorpay client
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_TEST_KEY_ID!,
    key_secret: process.env.RAZORPAY_TEST_KEY_SECRET!,
  });

  // 2. Create Razorpay Order (in paise)
  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });

  // 3. Get logged user
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;

  if (!jwt) throw new Error("Unauthorized. Please log in first");

  const { data: loggedUser } = await whoAmI(jwt);
  if (!loggedUser) throw new Error("User not found");

  // 4. If already premium, do NOT recreate order
  if (loggedUser.payment.isPremiumUser) {
    return {
      order: null,
      userEmail: loggedUser.email,
      userPhone: loggedUser.phone,
      alreadyPremium: true,
    };
  }

  // 5. Save orderId & status in MongoDB
  const user = await User.findByIdAndUpdate(
    loggedUser._id,
    {
      $set: {
        "payment.orderId": order.id,
        "payment.paymentStatus": "PENDING",
      },
    },
    { new: true } // return updated document
  ).lean();

  return {
    order,
    userEmail: user?.email,
    userPhone: user?.phone,
    alreadyPremium: false,
  };
}

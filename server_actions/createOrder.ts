"use server";

import { whoAmI } from "@/app/dashboard/settings/settingServerActions";
import User, { IUser } from "@/models/User";
import { cookies } from "next/headers";
import Razorpay from "razorpay";

export async function createOrder(amount: number) {
  const PREMIUM_AMOUNT = Number(process.env.PREMIUM_AMOUNT!);
  if (PREMIUM_AMOUNT !== amount) throw new Error("Dismatch the Premium Amount");
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_TEST_KEY_ID!,
    key_secret: process.env.RAZORPAY_TEST_KEY_SECRET!,
  });

  const order = await razorpay.orders.create({
    amount: amount * 100, // in paise
    currency: "INR",
    receipt: "receipt#1",
  });

  console.log(order);

  //   Get legged user data
  const cookieStore = cookies();
  const jwt = (await cookieStore).get("jwt")?.value;

  if (!jwt) throw new Error("Unauthorized. Please log in first");
  const { data: loggedUser } = await whoAmI(jwt);
  if (!loggedUser) throw new Error("User not found");
  console.log(loggedUser);
  //   update payment field in User Schema
  if (!loggedUser.payment.isPremiumUser) {
    const user = await User.findByIdAndUpdate(loggedUser._id, {
      $set: {
        "payment.orderId": order?.id,
        "payment.paymentStatus": "PENDING",
      },
    });

    return { order, userEmail: user?.email, userPhone: user?.phone }; // send order ID and User email to client
  }
}

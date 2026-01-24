"use server";

import crypto from "crypto";
import { RazorpayResponseType } from "@/components/ui/PremiumButton";
import { cookies } from "next/headers";
import { whoAmI } from "@/app/dashboard/settings/settingServerActions";
import User from "@/models/User";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { connectToMongo } from "@/lib/connectToMongo";

export async function verifyPayment(razorpayResponse: RazorpayResponseType) {
  // Ensure database connection before any DB operation
  await connectToMongo(); 
    
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    razorpayResponse;

  // Verify Razorpay signature to confirm payment authenticity
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_TEST_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new Error("Invalid Razorpay signature");
  }

  // Identify currently logged-in user via JWT cookie
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;

  if (!jwt) throw new Error("Unauthorized. Please login first");

  const { data: loggedUser } = await whoAmI(jwt);

  if (!loggedUser) throw new Error("User not found");

  // Ensure payment order belongs to the logged-in user
  if (loggedUser.payment.orderId !== razorpay_order_id) {
    throw new Error("Order ID mismatch");
  }

  // Grant premium access only once
  if (!loggedUser.payment.isPremiumUser) {
    await User.findByIdAndUpdate(loggedUser._id, {
      $set: {
        "payment.orderId": "",
        "payment.paymentStatus": "SUCCESS",
        "payment.isPremiumUser": true,
      },
    });
  }

  // Refresh cached content and redirect after successful payment
  revalidatePath("/home");
  redirect("/home");
}

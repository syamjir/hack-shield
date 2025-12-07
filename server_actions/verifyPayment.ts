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
    await connectToMongo(); 
    
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    razorpayResponse;

  // 1. Validate signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_TEST_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new Error("Invalid Razorpay signature");
  }

  console.log("✔ Payment verified successfully");

  // 2. Get logged user via JWT from cookies
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;

  if (!jwt) throw new Error("Unauthorized. Please login first");

  const { data: loggedUser } = await whoAmI(jwt);

  if (!loggedUser) throw new Error("User not found");

  // 3. Verify orderId matches the user record
  if (loggedUser.payment.orderId !== razorpay_order_id) {
    throw new Error("Order ID mismatch");
  }

  // 4. Update payment state (only if not already premium)
  if (!loggedUser.payment.isPremiumUser) {
    await User.findByIdAndUpdate(loggedUser._id, {
      $set: {
        "payment.orderId": "",
        "payment.paymentStatus": "SUCCESS",
        "payment.isPremiumUser": true,
      },
    });
  }

  // 5. Revalidate & redirect user
  revalidatePath("/home");
  redirect("/home");
}

"use server";
import crypto from "crypto";
import { RazorpayResponseType } from "@/components/ui/PremiumButton";
import { cookies } from "next/headers";
import { whoAmI } from "@/app/dashboard/settings/settingServerActions";
import User from "@/models/User";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function verifyPayment(razorpayResponse: RazorpayResponseType) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    razorpayResponse;

  const hmac = crypto
    .createHmac("sha256", process.env.RAZORPAY_TEST_KEY_SECRET!)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (hmac === razorpay_signature) {
    console.log("Payment successfull");
    // update User
    //   Get legged user data
    const cookieStore = cookies();
    const jwt = (await cookieStore).get("jwt")?.value;

    if (!jwt) throw new Error("Unauthorized. Please log in first");
    const { data: loggedUser } = await whoAmI(jwt);
    if (!loggedUser) throw new Error("User not found");

    //   Check orderId
    if (razorpay_order_id !== loggedUser.payment.orderId) {
      throw new Error("Order id not matching");
    }

    //   update payment field in User Schema
    if (!loggedUser.payment.isPremiumUser) {
      const user = await User.findByIdAndUpdate(loggedUser._id, {
        $set: {
          "payment.orderId": "",
          "payment.paymentStatus": "SUCCESS",
          "payment.isPremiumUser": true,
        },
      });
      revalidatePath("/home");
      redirect("/home");
    }
  }
}

import React, { useTransition } from "react";
import { Button } from "./button";
import { createOrder } from "@/server_actions/createOrder";
import { Loader } from "lucide-react";
import { verifyPayment } from "@/server_actions/verifyPayment";

export type RazorpayResponseType = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};
function PremiumButton() {
  const [isPending, startTransition] = useTransition();

  const handlePay = () => {
    startTransition(async () => {
      const response = await createOrder(199);
      const { order, userEmail, userPhone, alreadyPremium } = response;

      if (!response || alreadyPremium) {
        throw new Error("Failed to create order");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order?.amount,
        currency: "INR",
        name: "PassKeeper",
        description: "Test Transaction",
        order_id: order?.id,
        handler: async function (response: RazorpayResponseType) {
          await verifyPayment(response);
          alert("Payment Success!");
        },
        prefill: {
          name: "User",
          email: userEmail,
          contact: userPhone,
        },
        theme: {
          color: "#a06ece",
        },
      };
      //@ts-expect-error. This is razorpay direct javascript call
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    });
  };
  return (
    <Button
      onClick={handlePay}
      className="
      relative overflow-hidden 
      text-dark-a0 font-semibold px-6 py-3 rounded-xl 
      transition-all
      bg-surface-a10
      hover:bg-surface-a0/40 
    "
    >
      {/* Gold Glowing Border */}
      <span
        className="
        absolute inset-0 rounded-xl 
        border-2 border-yellow-400 
        shadow-[0_0_12px_rgba(255,215,0,0.8)]
        animate-pulse
      "
        aria-hidden="true"
      ></span>

      {/* Inner Content */}
      <span className="relative flex items-center gap-2 z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="gold"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3l2.25 6.75H21l-5.75 4.25L17.5 21 12 16.75 6.5 21l2.25-7L3 9.75h6.75L12 3z"
          />
        </svg>
        {isPending ? (
          <span className="flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin" />
            <span>Processing payment…</span>
          </span>
        ) : (
          "Upgrade to Premium — ₹199"
        )}
      </span>
    </Button>
  );
}

export default PremiumButton;

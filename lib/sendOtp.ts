import { IUser } from "@/models/User";
import EmailService from "./emailService";
import SmsService from "./smsService";

export async function sendOtp(
  user: IUser,
  purpose: "signup" | "login" | "reset" | "verify",
  selectedMethod?: "email" | "phone"
) {
  const code = user.createVerificationCode();
  const twoFactorMethod = selectedMethod || user.twoFactorMethod;

  if (twoFactorMethod === "email") {
    const mailService = new EmailService(user, code);
    if (purpose === "signup") {
      await mailService.sendSignupVerificationOtp();
    } else if (purpose === "login") {
      await mailService.sendLoginVerificationOtp();
    }
    //TODO reset and verify functionality
  } else if (twoFactorMethod === "phone") {
    const smsService = new SmsService(user.phone, code, purpose);
    await smsService.sendSms();
  }
}

class SmsService {
  private phone: string;
  private otp: string;
  private FAST2SMS_API_KEY: string;
  private purpose: "signup" | "login" | "reset" | "verify";

  constructor(
    phone: string,
    otp: string,
    purpose: "signup" | "login" | "reset" | "verify"
  ) {
    this.phone = phone;
    this.otp = otp;
    this.FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY as string;
    this.purpose = purpose;
  }

  private createMessage(): string {
    const otpMessages = {
      signup: (otp: string) =>
        `Welcome to PassKeeper! Your verification code is ${otp}. Please enter this code to complete your signup.`,

      login: (otp: string) =>
        `PassKeeper Login Alert: Use the code ${otp} to securely access your account. Do not share this code with anyone.`,

      reset: (otp: string) =>
        `PassKeeper Security: Use OTP ${otp} to reset your password. This code will expire in 5 minutes.`,

      verify: (otp: string) =>
        `Your PassKeeper OTP is ${otp}. Use this code to verify your identity. Do not share it with anyone.`,
    };

    const messageFn = otpMessages[this.purpose];
    return messageFn ? messageFn(this.otp) : `Your OTP is ${this.otp}`;
  }

  private makeBodyOtpSms() {
    return JSON.stringify({
      //   route: "v3",
      //   sender_id: "TXTIND",
      route: "q",
      message: this.createMessage(),
      language: "english",
      numbers: `+91${this.phone}`,
    });
  }

  async sendSms() {
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: this.FAST2SMS_API_KEY,
        "Content-Type": "application/json",
      },
      body: this.makeBodyOtpSms(),
    });

    const data = await response.json();
    console.log(data);
    return data;
  }
}

export default SmsService;

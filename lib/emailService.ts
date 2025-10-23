import nodemailer from "nodemailer";
import { IUser } from "@/models/User";
import { htmlToText } from "html-to-text";
import pug from "pug";
import path from "path";

class EmailService {
  private email: string;
  private firstName: string;
  private otp: string | null;
  private url?: string;
  private from: string;

  constructor(user: IUser, otp?: string, url?: string) {
    this.email = user.email;
    this.firstName = user.name?.split(" ")[0] || "User";
    this.otp = otp || null;
    this.url = url;
    this.from = `PassKeeper <${process.env.GMAIL_USER}>`;
  }

  private newTransport() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  private async sendMailToUser(
    template: string,
    subject: string,
    purpose: string
  ) {
    const templatePath = path.join(
      process.cwd(),
      "views",
      "email",
      `${template}.pug`
    );
    const html = pug.renderFile(templatePath, {
      firstName: this.firstName,
      otp: this.otp,
      url: this.url,
      subject,
      purpose,
    });

    const mailOptions = {
      from: this.from,
      to: this.email,
      subject,
      html,
      text: htmlToText(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendSignupVerificationOtp() {
    await this.sendMailToUser(
      "verificationOtp",
      "Your PassKeeper verification code (valid for 15 minutes)",
      "signup"
    );
  }
  async sendLoginVerificationOtp() {
    await this.sendMailToUser(
      "verificationOtp",
      "Your PassKeeper verification code (valid for 15 minutes)",
      "login"
    );
  }
  //TODO add reset and verify functions
}

export default EmailService;

import nodemailer from "nodemailer";
import { IUser } from "@/models/User";
import { htmlToText } from "html-to-text";
import pug from "pug";
import path from "path";

class EmailService {
  private email?: string;
  private firstName?: string;
  private otp?: string | null;
  private url?: string;
  private from: string;
  private emails?: string[];

  constructor(user?: IUser, otp?: string, url?: string, emails?: string[]) {
    this.email = user?.email;
    this.emails = emails;
    this.firstName = user?.name?.split(" ")[0] || "User";
    this.otp = otp || null;
    this.url = url;
    this.from = `PassKeeper <${process.env.GMAIL_USER}>`;
  }

  // Configure mail transport
  private newTransport() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  // Render template and send email
  private async sendMailToUser(
    template: string,
    subject: string,
    purpose?: string,
    message?: string
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
      message,
    });

    const mailOptions = {
      from: this.from,
      to: this.email || this.emails,
      subject,
      html,
      text: htmlToText(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  // Send OTP for signup
  async sendSignupVerificationOtp() {
    await this.sendMailToUser(
      "verificationOtp",
      "Your PassKeeper verification code (valid for 15 minutes)",
      "signup"
    );
  }

  // Send OTP for login
  async sendLoginVerificationOtp() {
    await this.sendMailToUser(
      "verificationOtp",
      "Your PassKeeper verification code (valid for 15 minutes)",
      "login"
    );
  }

  // Notify user about password change
  async sendPasswordChangeEmail() {
    await this.sendMailToUser(
      "passwordChange",
      "Your PassKeeper password was recently changed"
    );
  }

  // Send notification email to multiple users
  async sendNotificationToAllUsers(subject: string, message: string) {
    await this.sendMailToUser("notification", subject, message);
  }

  // TODO: Add reset & verification email methods
}

export default EmailService;
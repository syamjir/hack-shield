import { Form } from "@/app/auth/signup/page";

export class SignupValidation {
  private email: string;
  private password: string;
  private confirmPassword: string;
  private phone: string;

  constructor(form: Form, confirmPassword: string) {
    this.email = form.email;
    this.password = form.password;
    this.phone = form.phone;
    this.confirmPassword = confirmPassword;
  }

  // Check if password and confirm password match
  passwordMatch(): boolean {
    return !!(
      this.password &&
      this.confirmPassword &&
      this.password === this.confirmPassword
    );
  }

  // Validate email format
  emailValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  // Validate strong password (min 8 chars, uppercase, lowercase, number, special char)
  passwordValid(): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return passwordRegex.test(this.password);
  }

  // Validate 10-digit Indian phone number
  phoneValid(): boolean {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(this.phone);
  }
}
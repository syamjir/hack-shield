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

  // Validate password strength
  passwordValid(): boolean {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(this.password);
  }

  // 📞 Validate phone number
  phoneValid(): boolean {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(this.phone);
  }
}

export class LoginValidation {
  private email;
  private password;
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
  // Validate email format
  emailValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  // Validate password strength
  passwordValid(): boolean {
    // check password have at least 8 chars
    return this.password.length >= 8;
  }
}

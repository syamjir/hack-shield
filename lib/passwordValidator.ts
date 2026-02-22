export default class PasswordValidator {
  // Calculate password strength based on character diversity
  calculateStrength(
    password: string
  ): "Weak" | "Medium" | "Strong" {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return "Weak";
    if (score === 3 || score === 4) return "Medium";
    return "Strong";
  }

  // Validate HTTP/HTTPS URL
  isValidUri(uri: string): boolean {
    try {
      const url = new URL(uri);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }
}
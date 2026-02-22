import crypto from "crypto";

export class CryptoService {
  // Encryption key from environment variables
  private static readonly CRYPTO_ENCRYPTION_KEY =
    process.env.CRYPTO_ENCRYPTION_KEY!;

  private static readonly IV_LENGTH = 16;

  // Encrypt plain text using AES-256-CBC
  static encrypt(text: string): { encrypted: string; iv: string } {
    const iv = crypto.randomBytes(this.IV_LENGTH);

    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(this.CRYPTO_ENCRYPTION_KEY),
      iv
    );

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return { encrypted, iv: iv.toString("hex") };
  }

  // Decrypt encrypted data
  static decrypt(encrypted: string, ivHex: string): string {
    const iv = Buffer.from(ivHex, "hex");

    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(this.CRYPTO_ENCRYPTION_KEY),
      iv
    );

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }

  // Compare plain data with encrypted value
  static compareData(
    plainData: string,
    encryptedData: string,
    ivHex: string
  ): boolean {
    const decrypted = this.decrypt(encryptedData, ivHex);
    return plainData === decrypted;
  }
}
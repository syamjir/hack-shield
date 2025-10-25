export function generatePassword(length = 12): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
  
  export async function checkBreach(password: string): Promise<boolean> {
    const hashBuffer = await crypto.subtle.digest(
      "SHA-1",
      new TextEncoder().encode(password)
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
  
    const prefix = hashHex.slice(0, 5);
    const suffix = hashHex.slice(5);
  
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const text = await res.text();
  
    return text.includes(suffix);
  }
  
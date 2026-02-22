import { IUser } from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export class JwtService {
  private user;

  constructor(user?: IUser) {
    this.user = user;
  }

  // Generate login JWT
  private signInToken() {
    return jwt.sign(
      {
        id: this.user?._id,
        email: this.user?.email,
        role: this.user?.role,
      },
      process.env.JWT_SECRET as jwt.Secret,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      } as jwt.SignOptions
    );
  }

  // Generate short-lived OTP token
  generateOtpToken() {
    return jwt.sign(
      { id: this.user?._id },
      process.env.JWT_SECRET as jwt.Secret,
      {
        expiresIn: process.env.JWT_OTP_TOKEN_EXPIRES_IN,
      } as jwt.SignOptions
    );
  }

  // Send login response with JWT cookie
  createSendToken(
    message = "2FA verified — login successful"
  ): NextResponse {
    const token = this.signInToken();

    const response = NextResponse.json(
      {
        message,
        token,
        role: this.user?.role,
        preference: this.user?.preference,
        user: this.user,
      },
      { status: 200 }
    );

    response.cookies.set("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge:
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60,
    });

    return response;
  }

  // Clear JWT cookie (logout)
  createSendLogOutToken(
    message = "logout successful"
  ): NextResponse {
    const response = NextResponse.json(
      { message },
      { status: 200 }
    );

    response.cookies.set("jwt", "logout", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge:
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60,
    });

    return response;
  }

  // Verify and decode JWT
  async decodeJwtToken(
    token: string
  ): Promise<{ id: string; email?: string; role: "User" | "Admin" }> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        process.env.JWT_SECRET as jwt.Secret,
        (err, decoded) => {
          if (err || !decoded) {
            return reject(err || new Error("Invalid token"));
          }

          const payload = decoded as jwt.JwtPayload & {
            id: string;
            email: string;
            role: "User" | "Admin";
          };

          resolve({
            id: payload.id,
            email: payload?.email,
            role: payload?.role,
          });
        }
      );
    });
  }
}
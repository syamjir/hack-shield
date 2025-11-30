import { IUser } from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export class JwtService {
  private user;

  constructor(user?: IUser) {
    this.user = user;
  }

  private signInToken() {
    console.log("User role is:", this.user?.role);
    return jwt.sign(
      { id: this.user?._id, email: this.user?.email, role: this.user?.role },
      process.env.JWT_SECRET as jwt.Secret,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      } as jwt.SignOptions
    );
  }

  generateOtpToken() {
    return jwt.sign(
      { id: this.user?._id },
      process.env.JWT_SECRET as jwt.Secret,
      {
        expiresIn: process.env.JWT_OTP_TOKEN_EXPIRES_IN,
      } as jwt.SignOptions
    );
  }

  createSendToken(message = "2FA verified — login successful"): NextResponse {
    const token = this.signInToken();

    const response = NextResponse.json(
      {
        message: message,
        token,
        role: this.user?.role,
        preference: this.user?.preference,
      },
      { status: 200 }
    );
    response.cookies.set("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
      path: "/",
      maxAge: Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60,
    });

    return response;
  }
  createSendLogOutToken(message = "logout successful"): NextResponse {
    const response = NextResponse.json(
      {
        message: message,
      },
      { status: 200 }
    );
    response.cookies.set("jwt", "logout", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
      path: "/",
      maxAge: Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60,
    });

    return response;
  }

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

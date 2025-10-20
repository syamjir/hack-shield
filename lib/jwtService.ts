import { IUser } from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export class JwtService {
  private user;

  constructor(user?: IUser) {
    this.user = user;
  }

  private signInToken() {
    return jwt.sign(
      { id: this.user?._id, email: this.user?.email },
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

  createSendToken(): NextResponse {
    const token = this.signInToken();

    const response = NextResponse.json(
      { message: "Signup successful, , verification code sent", token },
      { status: 201 }
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

  async decodeJwtToken(token: string): Promise<{ id: string; email?: string }> {
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
          };
          resolve({ id: payload.id, email: payload?.email });
        }
      );
    });
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { IJosePayloadType } from "@/interfaces/jose-type";
import * as jose from "jose";

export const verifyAccessToken = async (token: string) => {
  try {
    const verifiedToken = await jose.jwtVerify<IJosePayloadType>(
      token,
      new TextEncoder().encode(process.env.JWT_ACCESS_TOKEN_SECRET),
    );

    return {
      success: true,
      message: "Token is valid",
      payload: verifiedToken,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Token is invalid",
      payload: null,
    };
  }
};

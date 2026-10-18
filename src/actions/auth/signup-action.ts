"use server";

import { ISignUpUser, UserRole } from "@/interfaces/user-type";
import { IResponseData } from "@/interfaces/util-type";
import { handleResponse } from "@/utils/handle-response";
import { serverFetch } from "@/utils/server-fetch";
import { setCookie } from "@/utils/token-handler";

export async function signupAction(
  payload: ISignUpUser,
  role: UserRole,
): Promise<IResponseData<{ accessToken: string }>> {
  try {
    const url =
      role === UserRole.MESS ? "/auth/register-mess" : "/auth/register-member";

    const response = await serverFetch.post(url, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const result = await handleResponse<{ accessToken: string }>(
      response,
      "Signup failed",
    );

    const accessToken = result.data?.accessToken;
    if (!accessToken) {
      return {
        httpStatusCode: 400,
        success: false,
        message: result.message || "Signup failed",
      };
    }

    await setCookie("access-token", accessToken, {
      secure: true,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1,
      path: "/",
      sameSite: "lax",
    });

    return result;
  } catch (error) {
    return {
      httpStatusCode: 500,
      success: false,
      message: error instanceof Error ? error.message : "Signup failed",
    };
  }
}

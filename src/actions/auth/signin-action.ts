import { UserRole } from "@/interfaces/user-type";
import { IResponseData } from "@/interfaces/util-type";
import { handleResponse } from "@/utils/handle-response";
import { serverFetch } from "@/utils/server-fetch";
import { setCookie } from "@/utils/token-handler";

interface SigninPayload {
  email: string;
  password: string;
}

export async function signinAction(
  payload: SigninPayload,
): Promise<IResponseData<{ accessToken: string; user: { role: UserRole } }>> {
  try {
    const response = await serverFetch.post("/auth/login", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const result = await handleResponse<{
      accessToken: string;
      user: { role: UserRole };
    }>(response, "Signin failed");

    const accessToken = result.data?.accessToken;
    if (!accessToken) {
      return {
        httpStatusCode: 400,
        success: false,
        message: result.message || "Signin failed",
      };
    }

    await setCookie("access-token", accessToken, {
      secure: true,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
    });

    return result;
  } catch (error) {
    return {
      httpStatusCode: 500,
      success: false,
      message: error instanceof Error ? error.message : "Signin failed",
    };
  }
}

import { IResponseData } from "@/interfaces/util-type";

export async function handleResponse<T>(
  response: Response,
  fallbackMessage = "Request failed",
): Promise<IResponseData<T>> {
  const result = await response.json();

  console.log("handleResponseData", result);

  if (!response.ok) {
    const validationError =
      result.message === "Validation error"
        ? result.errorSources?.[0]?.message
        : undefined;

    return {
      httpStatusCode: response.status,
      success: false,
      message: result.message || fallbackMessage,
      validationError,
    };
  }

  return {
    httpStatusCode: response.status,
    success: true,
    message: result.message || "Request successful",
    data: result.data,
    validationError: undefined,
  };
}

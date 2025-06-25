import { FetchError } from "ofetch";
import type { ZodIssue } from "zod";

export type StatuloError = { errorType: "code"; code: string; message: string } | { errorType: "validation"; errors: ZodIssue[] } | { errorType: "message"; message: string };

const validStatuloErrorTypes = ["code", "validation", "message"] as const;

export function isStatuloError(error: unknown): error is FetchError<StatuloError> {
  if (error instanceof FetchError) {
    return error.data && typeof error.data === "object" && error.data.errorType && validStatuloErrorTypes.includes(error.data.errorType);
  }
  return false;
}

export function getErrorMessage(error: unknown): string {
  // These are extracted into variables for easy localization in the future
  const unknownErrorMessage = "An unknown error occurred";
  const networkErrorMessage = "Network error occurred. Please try again later.";
  const validationErrorMessage = "Validation error occurred. Please check your input.";

  if (!error || !(error instanceof Error)) {
    return unknownErrorMessage;
  }

  if (error instanceof NetworkError) {
    return networkErrorMessage;
  }

  if (isStatuloError(error) && error.data) {
    const data = error.data;
    if (data.errorType === "code") {
      return data.message ?? data.code; // TODO: Use code for localization
    } else if (data.errorType === "validation") {
      return validationErrorMessage; // TODO: Should we return the validation errors? They would be handled in the form
    } else if (data.errorType === "message") {
      return data.message;
    }
  }

  return unknownErrorMessage;
}

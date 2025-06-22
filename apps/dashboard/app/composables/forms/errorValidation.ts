import type { ZodIssue } from "zod";
import { getInvisibleValidations } from "./errorTags";
import { getErrorMessage, isStatuloError } from "~/utils/errors";

export type ErrorDetails = {
  id: string;
  message: string | null;
};

function normalize(path: string): string {
  return path.replaceAll(/^[^.]+::/g, "");
}

export function useErrorValidation(
  formName?: string,
) {
  const errors = reactive({} as Record<string, string>);
  const globalErrorRef = ref<null | string>(null);
  const watchers: { stop: () => void; path: string }[] = [];

  onUnmounted(() => {
    watchers.forEach(v => v.stop());
  });

  function getErrorDetails(path: string): ErrorDetails {
    const id = normalize(path);
    return {
      id,
      message: errors[id] ?? null,
    };
  }

  function remove(path: string) {
    delete errors[normalize(path)];
  }

  function clear() {
    globalErrorRef.value = null;
    Object.keys(errors).forEach((key) => {
      remove(key);
    });
  }

  function publishErrors() {
    // make global error if there are invisible validations
    if (formName && !globalErrorRef.value) {
      const invisibleValidations = getInvisibleValidations(
        formName,
        Object.keys(errors),
      );
      if (invisibleValidations.length > 0) {
        globalErrorRef.value = "Not all validations are visible";
      }
    }

    // if no global error, don't publish anything
    if (!globalErrorRef.value) return;
  }

  function addZodError(issue: ZodIssue) {
    errors[issue.path.join(".")] = issue.message;
    // TODO publish errors to the form after zod issues
  }

  function insertError(inputError: Error) {
    clear();

    if (isStatuloError(inputError) && inputError.data?.errorType === "validation") {
      // TODO: Handle validation errors
    }

    globalErrorRef.value = getErrorMessage(inputError);
    publishErrors();
  }

  return {
    clear,
    publishErrors,
    addZodError,
    errors,
    globalError: () => globalErrorRef.value,
    insertError,
    getErrorDetails,
    remove,
  };
}

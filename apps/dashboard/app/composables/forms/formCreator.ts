import type { AnyZodObject, z, ZodEffects } from "zod";
import { useErrorValidation } from "./errorValidation";

export type FormValidateResult<TOutput> =
  | {
    success: true;
    data: TOutput;
  }
  | {
    success: false;
  };

export type FormError = {
  formId: string;
  content: {
    text: string;
    clear: () => void;
  } | null;
  id: string;
};

export type FormControls<TOutput, TInput> = {
  id: string;
  validate: () => FormValidateResult<TOutput>;
  reset: () => void;
  data: TInput;
  error: (key: string) => FormError;
  errors: {
    clear: () => void;
    validationErrors: () => Readonly<Record<string, string | undefined>>;
    formErrors: () => string | null;
    insert(errors: Error): void;
  };
};

export type FormOptions<TSchema extends AnyZodObject | ZodEffects<AnyZodObject>, TInput extends z.infer<TSchema>> = {
  id: string;
  init: () => TInput;
  schema: TSchema;
};

export const FORM_PREFIX = "FORM::";

export function createFormComposable<TSchema extends AnyZodObject | ZodEffects<AnyZodObject>, TInit extends z.infer<TSchema>>(
  ops: FormOptions<TSchema, TInit>,
): FormControls<z.infer<TSchema>, TInit> {
  const data = ref(ops.init()) as Ref<TInit>;
  const errors = useErrorValidation(ops.id);

  const controls: FormControls<z.infer<TSchema>, TInit> = {
    id: ops.id,
    reset() {
      data.value = ops.init();
      errors.clear();
    },
    error(key) {
      const err = errors.getErrorDetails(key);
      return {
        id: err.id,
        formId: ops.id,
        content: err.message === null
          ? null
          : {
              clear: () => {
                errors.remove(key);
              },
              text: err.message,
            },
      };
    },
    validate() {
      errors.clear();
      const parsed = ops.schema.safeParse(data.value);
      if (!parsed.success) {
        parsed.error.issues.forEach((issue) => {
          errors.addZodError(issue);
        });
        return { success: false };
      }

      return {
        success: true,
        data: parsed.data,
      };
    },
    get data() {
      return data.value;
    },
    errors: {
      clear() {
        errors.clear();
      },
      validationErrors() {
        return errors.errors;
      },
      formErrors() {
        return errors.globalError();
      },
      insert(err) {
        errors.insertError(err);
      },
    },
  };

  return controls;
}

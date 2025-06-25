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

export type FormControls<TInput, TOutput> = {
  id: string;
  validate: () => FormValidateResult<TOutput>;
  reset: () => void;
  data: TInput;
  changed: (key?: string) => boolean;
  changedFields: string[];
  error: (key: string) => FormError;
  errors: {
    clear: () => void;
    validationErrors: () => Readonly<Record<string, string | undefined>>;
    formErrors: () => string | null;
    insert(errors: Error): void;
  };
};

export type FormOptions<TSchema extends AnyZodObject | ZodEffects<AnyZodObject>> = {
  id: string;
  init: () => z.input<TSchema>;
  schema: TSchema;
};

export const FORM_PREFIX = "FORM::";

export function createFormComposable<TSchema extends AnyZodObject | ZodEffects<AnyZodObject>>(
  ops: FormOptions<TSchema>,
): FormControls<z.input<TSchema>, z.output<TSchema>> {
  const initialData = ref(ops.init()) as Ref<z.input<TSchema>>;
  const data = ref(structuredClone(toRaw(initialData.value))) as Ref<z.input<TSchema>>;
  const errors = useErrorValidation(ops.id);

  const changed = ref<string[]>([]);
  watch(data, () => {
    changed.value = getDeepChangedFields(initialData.value, data.value);
  }, { deep: true });

  const hasChanged = (key?: string) => {
    if (!key) return changed.value.length > 0;
    if (changed.value.length === 0) return false;
    const keySplit = key.split(".");

    // Check if the key is a prefix of any change
    return changed.value.some((change) => {
      const changeSplit = change.split(".");
      if (changeSplit.length < keySplit.length) return false;
      return changeSplit.slice(0, keySplit.length).join(".") === key;
    });
  };

  const controls: FormControls<z.input<TSchema>, z.output<TSchema>> = {
    id: ops.id,
    reset() {
      changed.value = [];
      errors.clear();

      const newInitialData = ops.init();
      initialData.value = newInitialData;
      data.value = structuredClone(newInitialData);
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
    get changedFields() {
      return changed.value;
    },
    changed: hasChanged,
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

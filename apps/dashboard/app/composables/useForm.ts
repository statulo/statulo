import type { AnyZodObject, z } from "zod";
import {
  createFormComposable,
  type FormControls,
  type FormOptions,
} from "./forms/formCreator";

export type ExpandedFormOptions = {
  showValidationToast?: boolean;
};

export function useForm<TSchema extends AnyZodObject, TInit>(
  ops: FormOptions<TSchema, TInit> & ExpandedFormOptions,
): FormControls<z.infer<TSchema>, TInit> {
  return createFormComposable({
    ...ops,
  });
}

import type { AnyZodObject, z, ZodEffects } from "zod";
import {
  createFormComposable,
  type FormControls,
  type FormOptions,
} from "./forms/formCreator";

export type ExpandedFormOptions = {
  showValidationToast?: boolean;
};

export function useForm<TSchema extends AnyZodObject | ZodEffects<AnyZodObject>, TInit extends z.infer<TSchema>>(
  ops: FormOptions<TSchema, TInit> & ExpandedFormOptions,
): FormControls<z.infer<TSchema>, TInit> {
  return createFormComposable({
    ...ops,
  });
}

import type { AnyZodObject, z, ZodEffects } from "zod";
import {
  createFormComposable,
  type FormControls,
  type FormOptions,
} from "./forms/formCreator";

export type ExpandedFormOptions = {
  showValidationToast?: boolean;
};

export function useForm<TSchema extends AnyZodObject | ZodEffects<AnyZodObject>>(
  ops: FormOptions<TSchema> & ExpandedFormOptions,
): FormControls<z.input<TSchema>, z.output<TSchema>> {
  return createFormComposable({
    ...ops,
  });
}

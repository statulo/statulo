const validationTagPrefix = "__FORM_VALIDATION_TAG::";

export function getValidationTagIdList(formName: string): string[] {
  const elements = [
    ...document.getElementsByClassName(
      `__FORM_VALIDATION_TAG_NAME::${formName}`,
    ),
  ];
  const errorIds = elements.flatMap(v =>
    [...v.classList].filter(v => v.startsWith(validationTagPrefix)),
  );
  return errorIds.map(v => v.split("::", 3)[2] ?? "");
}

/**
 * Check if a validation path is part of another validation path
 * @example isPartOfValidation("a.b.c", "a.b") => true
 * @example isPartOfValidation("a.b.c", "a.b.c") => true
 * @example isPartOfValidation("a.5.c", "a.b.c") => false
 */
function isPartOfValidation(target: string, parent: string): boolean {
  if (target === parent) return true;
  if (target.length <= parent.length) return false; // target is same or smaller size (while not being equal). cant return true
  if (!target.startsWith(parent)) return false; // beginning doesn't match parent. cant return true

  // to avoid cases like `isPartOfValidation("a.b.cd", "a.b.c")` returning true. the next char MUST be a dot.
  // we've already checked the cases it being exact. so we already known there is a next character to check
  const nextChar = target[parent.length]; // get next char
  if (nextChar !== ".") return false;
  return true;
}

export function getInvisibleValidations(
  formName: string,
  validations: string[],
) {
  const visibleTags = getValidationTagIdList(formName);
  const invisibleTags = validations.filter(
    v => !visibleTags.find(tag => isPartOfValidation(v, tag)),
  );
  return invisibleTags;
}

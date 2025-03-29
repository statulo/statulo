export type EnumType<E extends Record<string, string>> = E[keyof E];

/**
  * Extracts the parameters from a path string.
  *
  * @example
  * type Params = ExtractParams<'/organisation/:org/member/:mbr'>;
  * // type Params = "org" | "mbr"
  */
export type ExtractParams<T extends string> =
  T extends `${string}/:${infer Param}/${infer Rest}`
    ? Param | ExtractParams<`/${Rest}`>
    : T extends `${string}/:${infer Param}`
      ? Param
      : never;

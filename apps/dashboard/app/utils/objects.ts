import isEqual from "lodash/isEqual";

export function getDeepChangedFields<T>(a: T, b: T): string[] {
  const changes: string[] = [];

  const compare = (objA: any, objB: any, path: string[] = []) => {
    if (typeof objA !== "object" && typeof objB !== "object" && isEqual(objA, objB)) return;

    if (typeof objA !== "object" || typeof objB !== "object" || objA === null || objB === null) {
      changes.push(path.join("."));
      return;
    }

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    for (const key of new Set([...keysA, ...keysB])) {
      compare(objA[key], objB[key], [...path, key]);
    }
  };

  compare(a, b);
  return changes;
}

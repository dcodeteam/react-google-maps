export type Omit<T, TKey extends keyof T> = Pick<T, Exclude<keyof T, TKey>>;

function isObjectLike(value: unknown): value is object {
  return value != null && typeof value === "object";
}

interface Comparable {
  equals(other: Comparable): boolean;
}

function isComparable(value: unknown): value is Comparable {
  return isObjectLike(value) && "equals" in value;
}

function getObjectTag<T extends object>(value: T): string {
  return Object.prototype.toString.call(value);
}

function getKeys<T extends object>(value: T): Array<keyof T> {
  return (Array.isArray(value)
    ? value.map((_x, idx) => idx)
    : Object.keys(value)) as Array<keyof T>;
}

function isEqualWith<T>(
  a: T,
  b: T,
  comparator: (a: T[keyof T], b: T[keyof T], key: keyof T) => boolean,
): boolean {
  if (isStrictEqual(a, b)) {
    return true;
  }

  if (!isObjectLike(a) || !isObjectLike(b)) {
    return false;
  }

  const aTag = getObjectTag(a);
  const bTag = getObjectTag(b);

  /* istanbul ignore next */
  if (aTag !== bTag) {
    return false;
  }

  const aKeys = getKeys(a);
  const bKeys = getKeys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  for (let i = 0; i < aKeys.length; i++) {
    const key = aKeys[i];
    const aChild = a[key];
    const bChild = b[key];

    if (!comparator(aChild, bChild, key)) {
      return false;
    }
  }

  return true;
}

export function isStrictEqual<T>(a: T, b: T): boolean {
  return isComparable(a) && isComparable(b) ? a.equals(b) : Object.is(a, b);
}

export function isDeepEqual<T>(a: T, b: T): boolean {
  return isEqualWith(a, b, isDeepEqual);
}

export function pickChangedProps<T extends object>(
  prevProps: T,
  nextProps: T,
): null | Partial<T> {
  if (prevProps === nextProps) {
    return null;
  }

  const keys = Object.keys(nextProps) as Array<keyof T>;
  const diff: Partial<T> = {};
  let hasChanged = false;

  keys.forEach(key => {
    const prevValue = prevProps[key];
    const nextValue = nextProps[key];

    if (!isDeepEqual(prevValue, nextValue)) {
      hasChanged = true;
      diff[key] = nextValue;
    }
  });

  return hasChanged ? diff : null;
}

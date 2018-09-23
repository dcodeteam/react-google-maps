function isObject(value: unknown): value is object {
  return typeof value === "object";
}

interface Comparable {
  equals(other: Comparable): boolean;
}

function isComparable(value: unknown): value is Comparable {
  return isObject(value) && "equals" in value;
}

export function isStrictEqual<T>(a: T, b: T): boolean {
  return Object.is(a, b);
}

function isShallowEqualWith<T>(
  a: T,
  b: T,
  comparator: <K extends keyof T>(a: T[K], b: T[K]) => boolean,
): boolean {
  if (isStrictEqual(a, b)) {
    return true;
  }

  if (!isObject(a) || !isObject(b)) {
    return a === b;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    const { length } = a;

    if (length !== b.length) {
      return false;
    }

    for (let i = 0; i < length; i++) {
      const aValue = a[i];
      const bValue = b[i];

      if (!comparator(aValue, bValue)) {
        return false;
      }
    }
  } else {
    const aKeys = Object.keys(a) as Array<keyof T>;
    const bKeys = Object.keys(b) as Array<keyof T>;
    const { length } = aKeys;

    if (length !== bKeys.length) {
      return false;
    }

    for (let i = 0; i < length; i++) {
      const key = aKeys[i];
      const aValue = a[key];
      const bValue = b[key];

      if (!comparator(aValue, bValue)) {
        return false;
      }
    }
  }

  return true;
}

export function isShallowEqual<T>(a: T, b: T): boolean {
  return isShallowEqualWith(a, b, isStrictEqual);
}

export function isEqualProp<T>(a: T, b: T): boolean {
  return isComparable(a) && isComparable(b) ? a.equals(b) : isStrictEqual(a, b);
}

export function isShallowEqualProps<P>(prevProps: P, nextProps: P): boolean {
  return isShallowEqualWith(prevProps, nextProps, isEqualProp);
}

export function pickChangedProps<T extends object>(
  prevProps: T,
  nextProps: T,
): null | Partial<T> {
  const keys = Object.keys(nextProps) as Array<keyof T>;
  const diff: Partial<T> = {};
  let hasChanged = false;

  keys.forEach(key => {
    const prevValue = prevProps[key];
    const nextValue = nextProps[key];

    if (!isEqualProp(prevValue, nextValue)) {
      hasChanged = true;
      diff[key] = nextValue;
    }
  });

  return hasChanged ? diff : null;
}

type EventHandler<T> = (event: T) => void;

export function createHandlerProxy<T = any>(
  handlerSelector: () => undefined | EventHandler<T>,
): EventHandler<T> {
  return (event: T) => {
    const handler = handlerSelector();

    if (handler) {
      handler(event);
    }
  };
}

export function forEachEvent<P>(
  events: unknown,
  fn: (key: keyof P, event: string) => void,
) {
  const eventsObject = events as { [key: string]: string };
  const keys = Object.keys(eventsObject) as Array<keyof P>;

  keys.forEach(key => {
    fn(key, eventsObject[String(key)]);
  });
}

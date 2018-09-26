import { isStrictEqual } from "./DataUtils";

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

    if (!isStrictEqual(prevValue, nextValue)) {
      hasChanged = true;
      diff[key] = nextValue;
    }
  });

  return hasChanged ? diff : null;
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

import { isDeepEqual } from "./DataUtils";

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

    if (!isDeepEqual(prevValue, nextValue)) {
      hasChanged = true;
      diff[key] = nextValue;
    }
  });

  return hasChanged ? diff : null;
}

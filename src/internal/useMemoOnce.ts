import { useRef } from "react";

export function useMemoOnce<T>(factory: () => T): T {
  const ref = useRef<null | T>(null);

  if (!ref.current) {
    ref.current = factory();
  }

  return ref.current;
}

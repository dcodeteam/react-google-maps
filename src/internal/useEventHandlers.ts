import { useEffect, useRef } from "react";

export function useEventHandlers<
  P extends {
    // eslint-disable-next-line typescript/no-explicit-any
    [key in keyof P]: undefined | ((...args: any[]) => void)
  }
>(
  instance: null | google.maps.MVCObject,
  events: { [key in keyof P]: string },
  props: P,
): void {
  const propsRef = useRef(props);

  propsRef.current = props;

  useEffect(
    () => {
      if (!instance) {
        return;
      }

      const listeners = Object.entries<string>(events).map(
        ([handlerKey, eventType]) =>
          instance.addListener(eventType, (...args) => {
            const handler = propsRef.current[handlerKey as keyof P];

            if (handler) {
              handler(...args);
            }
          }),
      );

      return () => listeners.map(x => x.remove());
    },
    [events, instance],
  );
}

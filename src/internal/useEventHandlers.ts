import { useEffect, useRef } from "react";

export function useEventHandlers<
  TProps extends {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [TKey in keyof TProps]: undefined | ((...args: Array<any>) => void)
  }
>(
  instance: null | google.maps.MVCObject,
  events: { [TKey in keyof TProps]: string },
  props: TProps,
): void {
  const propsRef = useRef(props);

  propsRef.current = props;

  useEffect(() => {
    if (!instance) {
      return;
    }

    const listeners = Object.entries<string>(events).map(
      ([handlerKey, eventType]) =>
        instance.addListener(eventType, (...args) => {
          const handler = propsRef.current[handlerKey as keyof TProps];

          if (handler) {
            handler(...args);
          }
        }),
    );

    return () => listeners.map(x => x.remove());
  }, [events, instance]);
}

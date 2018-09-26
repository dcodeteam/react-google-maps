import * as React from "react";

import {
  GoogleMapContext,
  GoogleMapContextProvider,
} from "../google-map/GoogleMapContext";

export function getClassMockInstance(value: unknown) {
  return (value as jest.Mock).mock.results[0].value;
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

export function createMockHandlers<P>(events: unknown): Partial<P> {
  const props: Partial<P> = {};

  forEachEvent<P>(events, key => {
    // eslint-disable-next-line typescript/no-explicit-any
    props[key] = jest.fn() as any;
  });

  return props;
}

export function emitEvent(
  instance: unknown,
  event: string,
  ...args: unknown[]
): void {
  (instance as NodeJS.EventEmitter).emit(event, ...args);
}

export function createMockMapComponent<P>(Component: React.ComponentType<P>) {
  const map = new google.maps.Map(null);
  const context: GoogleMapContext = { map, maps: google.maps };

  function Mock(props: P) {
    return (
      <GoogleMapContextProvider value={context}>
        <Component {...props} />
      </GoogleMapContextProvider>
    );
  }

  return { map, Mock };
}

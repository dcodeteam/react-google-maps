import { forEachEvent } from "../internal/PropsUtils";

function getClassInstance(value: unknown) {
  return (value as jest.Mock).mock.results[0].value;
}

export function getMockMapInstance(): google.maps.Map {
  return getClassInstance(google.maps.Map);
}

export function getMockMarkerInstance(): google.maps.Marker {
  return getClassInstance(google.maps.Marker);
}

export function createMockHandlers<P>(events: unknown): Partial<P> {
  const props: Partial<P> = {};

  forEachEvent<P>(events, key => {
    // eslint-disable-next-line typescript/no-explicit-any
    props[key] = jest.fn() as any;
  });

  return props;
}

import { forEachEvent } from "../internal/PropsUtils";

const { Marker: OriginalMarker } = google.maps;

function getClassInstance(value: unknown) {
  return (value as jest.Mock).mock.results[0].value;
}

export function getMockMapInstance(): google.maps.Map {
  return getClassInstance(google.maps.Map);
}

export function mockMarker() {
  return jest
    .spyOn(google.maps, "Marker")
    .mockImplementation(options => new OriginalMarker(options));
}

export function createMockHandlers<P>(events: unknown): Partial<P> {
  const props: Partial<P> = {};

  forEachEvent<P>(events, key => {
    // eslint-disable-next-line typescript/no-explicit-any
    props[key] = jest.fn() as any;
  });

  return props;
}

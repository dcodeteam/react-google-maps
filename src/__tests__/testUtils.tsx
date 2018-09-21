import { forEachEvent } from "../internal/PropsUtils";

export function getClassMockInstance(value: unknown) {
  return (value as jest.Mock).mock.results[0].value;
}

export function createMockHandlers<P>(events: unknown): Partial<P> {
  const props: Partial<P> = {};

  forEachEvent<P>(events, key => {
    // eslint-disable-next-line typescript/no-explicit-any
    props[key] = jest.fn() as any;
  });

  return props;
}

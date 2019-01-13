export function getClassMockInstance(clazz: unknown) {
  return (clazz as jest.Mock).mock.results[0].value;
}

export function getFnMock<T>(fn: T): jest.Mock<T> {
  return (fn as unknown) as jest.Mock<T>;
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

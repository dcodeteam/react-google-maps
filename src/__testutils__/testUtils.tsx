// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getClassMockInstance(clazz: unknown): any {
  return (clazz as jest.Mock).mock.results[0].value;
}

export function getFnMock<T>(fn: T): jest.Mock<T> {
  return (fn as unknown) as jest.Mock<T>;
}

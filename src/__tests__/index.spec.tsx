import * as index from "../index";

describe("index", () => {
  it("should provide public api", () => {
    expect(index).toMatchSnapshot();
  });
});

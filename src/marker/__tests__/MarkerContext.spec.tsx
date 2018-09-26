import * as React from "react";
import { MarkerContextConsumer } from "../MarkerContext";
import { mount } from "enzyme";

describe("MarkerContext", () => {
  it("should not render 'children' if marker is not provided", () => {
    const consumer = jest.fn();

    mount(<MarkerContextConsumer>{consumer}</MarkerContextConsumer>);

    expect(consumer).toBeCalledTimes(0);
  });
});

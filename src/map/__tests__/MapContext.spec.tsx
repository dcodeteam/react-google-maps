import { mount } from "enzyme";
import * as React from "react";

import { MapContextConsumer } from "../MapContext";

describe("MapContext", () => {
  it("should not render if 'map' or 'maps' are not provided", () => {
    const consumer = jest.fn();

    mount(<MapContextConsumer>{consumer}</MapContextConsumer>);

    expect(consumer).toBeCalledTimes(0);
  });
});

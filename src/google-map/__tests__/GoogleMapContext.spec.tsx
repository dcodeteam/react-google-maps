import { mount } from "enzyme";
import * as React from "react";

import { GoogleMapContextConsumer } from "../GoogleMapContext";

describe("GoogleMapContext", () => {
  it("should not render if 'map' or 'maps' are not provided", () => {
    const consumer = jest.fn();

    mount(<GoogleMapContextConsumer>{consumer}</GoogleMapContextConsumer>);

    expect(consumer).toBeCalledTimes(0);
  });
});

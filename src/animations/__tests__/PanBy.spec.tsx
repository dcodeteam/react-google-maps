import { mount } from "enzyme";
import * as React from "react";

import { GoogleMapContextProvider } from "../../google-map-context/GoogleMapContext";
import { PanBy, PanByProps } from "../PanBy";

describe("PanBy", () => {
  const map = new google.maps.Map(null);

  function MockPanBy(props: PanByProps) {
    return (
      <GoogleMapContextProvider value={{ map, maps: google.maps }}>
        <PanBy {...props} />
      </GoogleMapContextProvider>
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should pan on mount", () => {
    mount(<MockPanBy x={10} y={15} />);

    expect(map.panBy).toBeCalledTimes(1);
    expect(map.panBy).lastCalledWith(10, 15);
  });

  it("should pan on update", () => {
    const wrapper = mount(<MockPanBy x={10} y={15} />);

    expect(map.panBy).toBeCalledTimes(1);

    wrapper.setProps({ x: 0 });

    expect(map.panBy).toBeCalledTimes(2);
    expect(map.panBy).lastCalledWith(0, 15);

    wrapper.setProps({ y: 0 });

    expect(map.panBy).toBeCalledTimes(3);
    expect(map.panBy).lastCalledWith(0, 0);
  });
});

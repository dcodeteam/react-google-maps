import { mount } from "enzyme";
import * as React from "react";

import { GoogleMapContextProvider } from "../../google-map/GoogleMapContext";
import { PointLiteral } from "../../internal/MapsUtils";
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
    mount(<MockPanBy offset={{ x: 1, y: 2 }} />);

    expect(map.panBy).toBeCalledTimes(1);
    expect(map.panBy).lastCalledWith(1, 2);
  });

  it("should pan on update", () => {
    const initialOffset: PointLiteral = { x: 1, y: 2 };
    const updatedOffset: PointLiteral = { x: 3, y: 4 };

    const wrapper = mount(<MockPanBy offset={initialOffset} />);

    expect(map.panBy).toBeCalledTimes(1);

    wrapper.setProps({ offset: initialOffset });

    expect(map.panBy).toBeCalledTimes(1);

    wrapper.setProps({ offset: updatedOffset });

    expect(map.panBy).toBeCalledTimes(2);
    expect(map.panBy).lastCalledWith(updatedOffset.x, updatedOffset.y);
  });
});

import { mount } from "enzyme";
import * as React from "react";

import { GoogleMapContextProvider } from "../../map/MapContext";
import { PanToBounds, PanToBoundsProps } from "../PanToBounds";

describe("PanToBounds", () => {
  const map = new google.maps.Map(null);

  function MockPanToBounds(props: PanToBoundsProps) {
    return (
      <GoogleMapContextProvider value={{ map, maps: google.maps }}>
        <PanToBounds {...props} />
      </GoogleMapContextProvider>
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should pan to bounds on mount", () => {
    const bounds: google.maps.LatLngBoundsLiteral = {
      north: 1,
      east: 1,
      south: 2,
      west: 2,
    };

    mount(<MockPanToBounds bounds={bounds} />);

    expect(map.panToBounds).toBeCalledTimes(1);
    expect(map.panToBounds).lastCalledWith(bounds);
  });

  it("should fit bounds on mount", () => {
    const initialBounds: google.maps.LatLngBoundsLiteral = {
      north: 1,
      east: 1,
      south: 2,
      west: 2,
    };
    const updatedBounds: google.maps.LatLngBoundsLiteral = {
      north: 3,
      east: 3,
      south: 4,
      west: 4,
    };

    const wrapper = mount(<MockPanToBounds bounds={initialBounds} />);

    expect(map.panToBounds).toBeCalledTimes(1);

    wrapper.setProps({ bounds: initialBounds });

    expect(map.panToBounds).toBeCalledTimes(1);

    wrapper.setProps({ bounds: updatedBounds });

    expect(map.panToBounds).toBeCalledTimes(2);
    expect(map.panToBounds).lastCalledWith(updatedBounds);
  });
});

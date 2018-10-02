import { mount } from "enzyme";
import * as React from "react";

import { GoogleMapContextProvider } from "../../map/MapContext";
import { FitBounds, FitBoundsProps } from "../FitBounds";

describe("FitBounds", () => {
  const map = new google.maps.Map(null);

  function MockFitBounds(props: FitBoundsProps) {
    return (
      <GoogleMapContextProvider value={{ map, maps: google.maps }}>
        <FitBounds {...props} />
      </GoogleMapContextProvider>
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fit bounds on mount", () => {
    const bounds: google.maps.LatLngBoundsLiteral = {
      east: 1,
      north: 2,
      south: 3,
      west: 4,
    };

    mount(<MockFitBounds bounds={bounds} />);

    expect(map.fitBounds).toBeCalledTimes(1);
    expect(map.fitBounds).lastCalledWith(bounds);
  });

  it("should fit bounds on update", () => {
    const initialBounds: google.maps.LatLngBoundsLiteral = {
      east: 1,
      north: 2,
      south: 3,
      west: 4,
    };
    const updatedBounds: google.maps.LatLngBoundsLiteral = {
      east: 5,
      north: 6,
      south: 7,
      west: 8,
    };

    const wrapper = mount(<MockFitBounds bounds={initialBounds} />);

    expect(map.fitBounds).toBeCalledTimes(1);

    wrapper.setProps({ bounds: initialBounds });

    expect(map.fitBounds).toBeCalledTimes(1);

    wrapper.setProps({ bounds: updatedBounds });

    expect(map.fitBounds).toBeCalledTimes(2);
    expect(map.fitBounds).lastCalledWith(updatedBounds);
  });
});

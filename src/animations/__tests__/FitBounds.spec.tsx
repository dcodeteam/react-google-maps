import { mount } from "enzyme";
import * as React from "react";

import { GoogleMapContextProvider } from "../../google-map-context/GoogleMapContext";
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

    mount(<MockFitBounds latLngBounds={bounds} />);

    expect(map.fitBounds).toBeCalledTimes(1);
    expect(map.fitBounds).lastCalledWith(bounds);
  });

  it("should fit bounds on update", () => {
    const wrapper = mount(
      <MockFitBounds latLngBounds={{ east: 1, north: 2, south: 3, west: 4 }} />,
    );

    expect(map.fitBounds).toBeCalledTimes(1);

    const latLngBounds: google.maps.LatLngBoundsLiteral = {
      east: 5,
      north: 6,
      south: 7,
      west: 8,
    };

    wrapper.setProps({ latLngBounds });

    expect(map.fitBounds).toBeCalledTimes(2);
    expect(map.fitBounds).lastCalledWith(latLngBounds);
  });
});

import { mount } from "enzyme";
import * as React from "react";

import { GoogleMapContextProvider } from "../../google-map-context/GoogleMapContext";
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
      east: 1,
      north: 2,
      south: 3,
      west: 4,
    };

    mount(<MockPanToBounds latLngBounds={bounds} />);

    expect(map.panToBounds).toBeCalledTimes(1);
    expect(map.panToBounds).lastCalledWith(bounds);
  });

  it("should fit bounds on mount", () => {
    const wrapper = mount(
      <MockPanToBounds
        latLngBounds={{
          east: 1,
          north: 2,
          south: 3,
          west: 4,
        }}
      />,
    );

    expect(map.panToBounds).toBeCalledTimes(1);

    const latLngBounds: google.maps.LatLngBoundsLiteral = {
      east: 5,
      north: 6,
      south: 7,
      west: 8,
    };

    wrapper.setProps({ latLngBounds });

    expect(map.panToBounds).toBeCalledTimes(2);
    expect(map.panToBounds).lastCalledWith(latLngBounds);
  });
});

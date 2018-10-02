import { mount } from "enzyme";
import * as React from "react";

import { GoogleMapContextProvider } from "../../map/MapContext";
import { PanTo, PanToProps } from "../PanTo";

describe("PanTo", () => {
  const map = new google.maps.Map(null);

  function MockPanTo(props: PanToProps) {
    return (
      <GoogleMapContextProvider value={{ map, maps: google.maps }}>
        <PanTo {...props} />
      </GoogleMapContextProvider>
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should pan on mount", () => {
    const position: google.maps.LatLngLiteral = { lat: 1, lng: 2 };

    mount(<MockPanTo position={position} />);

    expect(map.panTo).toBeCalledTimes(1);
    expect(map.panTo).lastCalledWith(position);
  });

  it("should pan on update", () => {
    const initialPosition: google.maps.LatLngLiteral = { lat: 1, lng: 2 };
    const updatedPosition: google.maps.LatLngLiteral = { lat: 3, lng: 4 };

    const wrapper = mount(<MockPanTo position={initialPosition} />);

    expect(map.panTo).toBeCalledTimes(1);

    wrapper.setProps({ position: initialPosition });

    expect(map.panTo).toBeCalledTimes(1);

    wrapper.setProps({ position: updatedPosition });

    expect(map.panTo).toBeCalledTimes(2);
    expect(map.panTo).lastCalledWith(updatedPosition);
  });
});

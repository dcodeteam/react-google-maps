import { mount } from "enzyme";
import * as React from "react";

import { GoogleMapContextProvider } from "../../google-map-context/GoogleMapContext";
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
    const latLng: google.maps.LatLngLiteral = { lat: 10, lng: 15 };

    mount(<MockPanTo latLng={latLng} />);

    expect(map.panTo).toHaveBeenCalledTimes(1);
    expect(map.panTo).toHaveBeenLastCalledWith(latLng);
  });

  it("should pan on update", () => {
    const wrapper = mount(<MockPanTo latLng={{ lat: 10, lng: 15 }} />);

    expect(map.panTo).toHaveBeenCalledTimes(1);

    const latLng: google.maps.LatLngLiteral = { lat: 15, lng: 15 };

    wrapper.setProps({ latLng });

    expect(map.panTo).toHaveBeenCalledTimes(2);
    expect(map.panTo).toHaveBeenLastCalledWith(latLng);
  });
});

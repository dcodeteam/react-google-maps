import { mount } from "enzyme";
import * as React from "react";

import { GoogleMapContextProvider } from "../../google-map/GoogleMapContext";
import { ZoomControl, ZoomControlProps } from "../ZoomControl";

describe("ZoomControl", () => {
  const map = new google.maps.Map(null);

  function MockZoomControl(props: ZoomControlProps) {
    return (
      <GoogleMapContextProvider value={{ map, maps: google.maps }}>
        <ZoomControl {...props} />
      </GoogleMapContextProvider>
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should set default values on mount", () => {
    mount(<MockZoomControl />);

    expect(map.setValues).toBeCalledTimes(1);
    expect(map.setValues).lastCalledWith({
      zoomControl: true,
      zoomControlOptions: { position: "TOP_LEFT" },
    });
  });

  it("should set custom values on mount", () => {
    mount(<MockZoomControl position="BOTTOM_CENTER" />);

    expect(map.setValues).toBeCalledTimes(1);
    expect(map.setValues).lastCalledWith({
      zoomControl: true,
      zoomControlOptions: { position: "BOTTOM_CENTER" },
    });
  });

  it("should set custom values on update", () => {
    const wrapper = mount(<MockZoomControl />);

    expect(map.setValues).toBeCalledTimes(1);

    wrapper.setProps({ position: "BOTTOM_CENTER" });

    expect(map.setValues).toBeCalledTimes(2);
    expect(map.setValues).lastCalledWith({
      zoomControl: true,
      zoomControlOptions: { position: "BOTTOM_CENTER" },
    });

    wrapper.setProps({ position: "BOTTOM_CENTER" });

    expect(map.setValues).toBeCalledTimes(2);

    wrapper.setProps({ position: "TOP_LEFT" });

    expect(map.setValues).toBeCalledTimes(3);

    expect(map.setValues).lastCalledWith({
      zoomControl: true,
      zoomControlOptions: { position: "TOP_LEFT" },
    });
  });

  it("should unset values on unmount", () => {
    const wrapper = mount(<MockZoomControl />);

    expect(map.setValues).toBeCalledTimes(1);

    wrapper.unmount();

    expect(map.setValues).toBeCalledTimes(2);
    expect(map.setValues).lastCalledWith({
      zoomControl: false,
      zoomControlOptions: undefined,
    });
  });
});

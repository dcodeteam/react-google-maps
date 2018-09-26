import { mount } from "enzyme";
import * as React from "react";

import { GoogleMapContextProvider } from "../../google-map/GoogleMapContext";
import {
  StreetViewControl,
  StreetViewControlProps,
} from "../StreetViewControl";

describe("StreetViewControl", () => {
  const map = new google.maps.Map(null);

  function MockStreetViewControl(props: StreetViewControlProps) {
    return (
      <GoogleMapContextProvider value={{ map, maps: google.maps }}>
        <StreetViewControl {...props} />
      </GoogleMapContextProvider>
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should set default values on mount", () => {
    mount(<MockStreetViewControl />);

    expect(map.setValues).toBeCalledTimes(1);
    expect(map.setValues).lastCalledWith({
      streetViewControl: true,
      streetViewControlOptions: { position: "TOP_LEFT" },
    });
  });

  it("should set custom values on mount", () => {
    mount(<MockStreetViewControl position="BOTTOM_CENTER" />);

    expect(map.setValues).toBeCalledTimes(1);
    expect(map.setValues).lastCalledWith({
      streetViewControl: true,
      streetViewControlOptions: { position: "BOTTOM_CENTER" },
    });
  });

  it("should set custom values on update", () => {
    const wrapper = mount(<MockStreetViewControl />);

    expect(map.setValues).toBeCalledTimes(1);

    wrapper.setProps({ position: "BOTTOM_CENTER" });

    expect(map.setValues).toBeCalledTimes(2);
    expect(map.setValues).lastCalledWith({
      streetViewControl: true,
      streetViewControlOptions: { position: "BOTTOM_CENTER" },
    });

    wrapper.setProps({ position: "BOTTOM_CENTER" });

    expect(map.setValues).toBeCalledTimes(2);

    wrapper.setProps({ position: "TOP_LEFT" });

    expect(map.setValues).toBeCalledTimes(3);

    expect(map.setValues).lastCalledWith({
      streetViewControl: true,
      streetViewControlOptions: { position: "TOP_LEFT" },
    });
  });

  it("should unset values on unmount", () => {
    const wrapper = mount(<MockStreetViewControl />);

    expect(map.setValues).toBeCalledTimes(1);

    wrapper.unmount();

    expect(map.setValues).toBeCalledTimes(2);
    expect(map.setValues).lastCalledWith({
      streetViewControl: false,
      streetViewControlOptions: undefined,
    });
  });
});

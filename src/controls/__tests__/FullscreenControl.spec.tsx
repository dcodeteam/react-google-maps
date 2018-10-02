import { mount } from "enzyme";
import * as React from "react";

import { GoogleMapContextProvider } from "../../map/MapContext";
import {
  FullscreenControl,
  FullscreenControlProps,
} from "../FullscreenControl";

describe("FullscreenControl", () => {
  const map = new google.maps.Map(null);

  function MockFullscreenControl(props: FullscreenControlProps) {
    return (
      <GoogleMapContextProvider value={{ map, maps: google.maps }}>
        <FullscreenControl {...props} />
      </GoogleMapContextProvider>
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should set default values on mount", () => {
    mount(<MockFullscreenControl />);

    expect(map.setValues).toBeCalledTimes(1);
    expect(map.setValues).lastCalledWith({
      fullscreenControl: true,
      fullscreenControlOptions: { position: "RIGHT_TOP" },
    });
  });

  it("should set custom values on mount", () => {
    mount(<MockFullscreenControl position="BOTTOM_CENTER" />);

    expect(map.setValues).toBeCalledTimes(1);
    expect(map.setValues).lastCalledWith({
      fullscreenControl: true,
      fullscreenControlOptions: { position: "BOTTOM_CENTER" },
    });
  });

  it("should set custom values on update", () => {
    const wrapper = mount(<MockFullscreenControl />);

    expect(map.setValues).toBeCalledTimes(1);

    wrapper.setProps({ position: "BOTTOM_CENTER" });

    expect(map.setValues).toBeCalledTimes(2);
    expect(map.setValues).lastCalledWith({
      fullscreenControl: true,
      fullscreenControlOptions: { position: "BOTTOM_CENTER" },
    });

    wrapper.setProps({ position: "BOTTOM_CENTER" });

    expect(map.setValues).toBeCalledTimes(2);

    wrapper.setProps({ position: "RIGHT_TOP" });

    expect(map.setValues).toBeCalledTimes(3);

    expect(map.setValues).lastCalledWith({
      fullscreenControl: true,
      fullscreenControlOptions: { position: "RIGHT_TOP" },
    });
  });

  it("should unset values on unmount", () => {
    const wrapper = mount(<MockFullscreenControl />);

    expect(map.setValues).toBeCalledTimes(1);

    wrapper.unmount();

    expect(map.setValues).toBeCalledTimes(2);
    expect(map.setValues).lastCalledWith({
      fullscreenControl: false,
      fullscreenControlOptions: undefined,
    });
  });
});

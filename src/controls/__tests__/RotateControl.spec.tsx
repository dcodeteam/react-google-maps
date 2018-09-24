import { mount } from "enzyme";
import * as React from "react";

import { GoogleMapContextProvider } from "../../google-map-context/GoogleMapContext";
import { RotateControl, RotateControlProps } from "../RotateControl";

describe("RotateControl", () => {
  const map = new google.maps.Map(null);

  function MockRotateControl(props: RotateControlProps) {
    return (
      <GoogleMapContextProvider value={{ map, maps: google.maps }}>
        <RotateControl {...props} />
      </GoogleMapContextProvider>
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should set default values on mount", () => {
    mount(<MockRotateControl />);

    expect(map.setValues).toBeCalledTimes(1);
    expect(map.setValues).lastCalledWith({
      rotateControl: true,
      rotateControlOptions: { position: "TOP_LEFT" },
    });
  });

  it("should set custom values on mount", () => {
    mount(<MockRotateControl position="BOTTOM_CENTER" />);

    expect(map.setValues).toBeCalledTimes(1);
    expect(map.setValues).lastCalledWith({
      rotateControl: true,
      rotateControlOptions: { position: "BOTTOM_CENTER" },
    });
  });

  it("should set custom values on update", () => {
    const wrapper = mount(<MockRotateControl />);

    expect(map.setValues).toBeCalledTimes(1);

    wrapper.setProps({ position: "BOTTOM_CENTER" });

    expect(map.setValues).toBeCalledTimes(2);
    expect(map.setValues).lastCalledWith({
      rotateControl: true,
      rotateControlOptions: { position: "BOTTOM_CENTER" },
    });

    wrapper.setProps({ position: "BOTTOM_CENTER" });

    expect(map.setValues).toBeCalledTimes(2);

    wrapper.setProps({ position: "TOP_LEFT" });

    expect(map.setValues).toBeCalledTimes(3);

    expect(map.setValues).lastCalledWith({
      rotateControl: true,
      rotateControlOptions: { position: "TOP_LEFT" },
    });
  });

  it("should unset values on unmount", () => {
    const wrapper = mount(<MockRotateControl />);

    expect(map.setValues).toBeCalledTimes(1);

    wrapper.unmount();

    expect(map.setValues).toBeCalledTimes(2);
    expect(map.setValues).lastCalledWith({
      rotateControl: false,
      rotateControlOptions: undefined,
    });
  });
});

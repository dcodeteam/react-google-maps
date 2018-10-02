import { mount } from "enzyme";
import * as React from "react";

import { GoogleMapContextProvider } from "../../map/MapContext";
import { MapTypeControl, MapTypeControlProps } from "../MapTypeControl";

describe("MapTypeControl", () => {
  const map = new google.maps.Map(null);

  function MockMapTypeControl(props: MapTypeControlProps) {
    return (
      <GoogleMapContextProvider value={{ map, maps: google.maps }}>
        <MapTypeControl {...props} />
      </GoogleMapContextProvider>
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should set default values on mount", () => {
    mount(<MockMapTypeControl />);

    expect(map.setValues).toBeCalledTimes(1);
    expect(map.setValues).lastCalledWith({
      mapTypeControl: true,
      mapTypeControlOptions: {
        mapTypeIds: ["HYBRID", "ROADMAP", "SATELLITE", "TERRAIN"],
        position: "TOP_RIGHT",
        style: "DEFAULT",
      },
    });
  });

  it("should set custom values on mount", () => {
    mount(
      <MockMapTypeControl
        style="DROPDOWN_MENU"
        position="RIGHT_BOTTOM"
        mapTypeIds={["HYBRID", "ROADMAP"]}
      />,
    );

    expect(map.setValues).toBeCalledTimes(1);
    expect(map.setValues).lastCalledWith({
      mapTypeControl: true,
      mapTypeControlOptions: {
        mapTypeIds: ["HYBRID", "ROADMAP"],
        position: "RIGHT_BOTTOM",
        style: "DROPDOWN_MENU",
      },
    });
  });

  it("should set custom values on update", () => {
    const wrapper = mount(<MockMapTypeControl />);

    expect(map.setValues).toBeCalledTimes(1);

    wrapper.setProps({ position: "BOTTOM_CENTER" });

    expect(map.setValues).toBeCalledTimes(2);
    expect(map.setValues).lastCalledWith({
      mapTypeControl: true,
      mapTypeControlOptions: {
        mapTypeIds: ["HYBRID", "ROADMAP", "SATELLITE", "TERRAIN"],
        position: "BOTTOM_CENTER",
        style: "DEFAULT",
      },
    });

    wrapper.setProps({ position: "BOTTOM_CENTER" });

    expect(map.setValues).toBeCalledTimes(2);

    wrapper.setProps({ position: "RIGHT_TOP" });

    expect(map.setValues).toBeCalledTimes(3);

    expect(map.setValues).lastCalledWith({
      mapTypeControl: true,
      mapTypeControlOptions: {
        mapTypeIds: ["HYBRID", "ROADMAP", "SATELLITE", "TERRAIN"],
        position: "RIGHT_TOP",
        style: "DEFAULT",
      },
    });
  });

  it("should unset values on unmount", () => {
    const wrapper = mount(<MockMapTypeControl />);

    expect(map.setValues).toBeCalledTimes(1);

    wrapper.unmount();

    expect(map.setValues).toBeCalledTimes(2);
    expect(map.setValues).lastCalledWith({
      mapTypeControl: false,
      mapTypeControlOptions: undefined,
    });
  });
});

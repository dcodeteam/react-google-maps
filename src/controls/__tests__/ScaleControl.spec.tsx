import { mount } from "enzyme";
import * as React from "react";

import { GoogleMapContextProvider } from "../../map/MapContext";
import { ScaleControl } from "../ScaleControl";

describe("ScaleControl", () => {
  const map = new google.maps.Map(null);

  function MockScaleControl() {
    return (
      <GoogleMapContextProvider value={{ map, maps: google.maps }}>
        <ScaleControl />
      </GoogleMapContextProvider>
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should set default values on mount", () => {
    mount(<MockScaleControl />);

    expect(map.setValues).toBeCalledTimes(1);
    expect(map.setValues).lastCalledWith({
      scaleControl: true,
      scaleControlOptions: undefined,
    });
  });

  it("should unset values on unmount", () => {
    const wrapper = mount(<MockScaleControl />);

    expect(map.setValues).toBeCalledTimes(1);

    wrapper.unmount();

    expect(map.setValues).toBeCalledTimes(2);
    expect(map.setValues).lastCalledWith({
      scaleControl: false,
      scaleControlOptions: undefined,
    });
  });
});

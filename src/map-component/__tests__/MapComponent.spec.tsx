import { mount } from "enzyme";
import * as React from "react";

import { GoogleMapContextProvider } from "../../google-map/GoogleMapContext";
import { MapComponent, MapComponentProps } from "../MapComponent";

describe("MapComponent", () => {
  const map = new google.maps.Map(null);

  function MockMapComponent<O, S>(props: MapComponentProps<O, S>) {
    return (
      <GoogleMapContextProvider value={{ map, maps: google.maps }}>
        <MapComponent {...props} />
      </GoogleMapContextProvider>
    );
  }

  it("should mount without errors", () => {
    expect(() =>
      mount(<MockMapComponent createOptions={() => null} />),
    ).not.toThrow();
  });

  it("should update without errors", () => {
    const wrapper = mount(<MockMapComponent createOptions={() => null} />);

    expect(() => wrapper.setProps({ prop: 1 })).not.toThrow();
  });

  it("should unmount without errors", () => {
    const wrapper = mount(<MockMapComponent createOptions={() => null} />);

    expect(() => wrapper.unmount()).not.toThrow();
  });
});

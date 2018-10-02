import { mount } from "enzyme";
import * as React from "react";

import { GoogleMapContextProvider } from "../../map/MapContext";
import { MarkerContextProvider } from "../MarkerContext";
import { MarkerSymbol, MarkerSymbolProps } from "../MarkerSymbol";

describe("MarkerSymbol", () => {
  const map = new google.maps.Map(null);
  const marker = new google.maps.Marker();

  function MockMarkerSymbol(props: MarkerSymbolProps) {
    return (
      <GoogleMapContextProvider value={{ map, maps: google.maps }}>
        <MarkerContextProvider value={{ marker }}>
          <MarkerSymbol {...props} />
        </MarkerContextProvider>
      </GoogleMapContextProvider>
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should set default marker icon options on mount", () => {
    mount(<MockMarkerSymbol path="svg-path" />);

    expect(marker.setIcon).toBeCalledTimes(1);
    expect(marker.setIcon).lastCalledWith({
      anchor: { x: 0, y: 0 },
      fillColor: "black",
      fillOpacity: 0,
      path: "svg-path",
      rotation: 0,
      scale: 1,
      strokeColor: "black",
      strokeOpacity: 1,
      strokeWeight: 1,
    });
  });

  it("should set custom marker icon options on mount", () => {
    mount(
      <MockMarkerSymbol
        path="svg-path"
        scale={0.7}
        rotation={1}
        fillColor="black"
        fillOpacity={0.5}
        strokeColor="white"
        strokeWeight={2}
        strokeOpacity={3}
        anchor={{ x: 10, y: 15 }}
      />,
    );

    expect(marker.setIcon).toBeCalledTimes(1);
    expect(marker.setIcon).lastCalledWith({
      anchor: { x: 10, y: 15 },
      fillColor: "black",
      fillOpacity: 0.5,
      path: "svg-path",
      rotation: 1,
      scale: 0.7,
      strokeColor: "white",
      strokeOpacity: 3,
      strokeWeight: 2,
    });
  });

  it("should change icon options on update", () => {
    const wrapper = mount(<MockMarkerSymbol path="svg-path" />);

    expect(marker.setIcon).toBeCalledTimes(1);

    wrapper.setProps({
      anchor: { x: 10, y: 15 },
      fillColor: "black",
      fillOpacity: 0.5,
      path: "svg-path",
      rotation: 1,
      scale: 0.7,
      strokeColor: "white",
      strokeOpacity: 3,
      strokeWeight: 2,
    });

    expect(marker.setIcon).toBeCalledTimes(2);
    expect(marker.setIcon).lastCalledWith({
      anchor: { x: 10, y: 15 },
      fillColor: "black",
      fillOpacity: 0.5,
      path: "svg-path",
      rotation: 1,
      scale: 0.7,
      strokeColor: "white",
      strokeOpacity: 3,
      strokeWeight: 2,
    });
  });

  it("should not change with same icon options on update", () => {
    const wrapper = mount(<MockMarkerSymbol path="svg-path" />);

    expect(marker.setIcon).toBeCalledTimes(1);

    wrapper.setProps({ path: "svg-path" });

    expect(marker.setIcon).toBeCalledTimes(1);

    wrapper.setProps({ path: "another-svg-path" });

    expect(marker.setIcon).toBeCalledTimes(2);
    expect(marker.setIcon).lastCalledWith({
      anchor: { x: 0, y: 0 },
      fillColor: "black",
      fillOpacity: 0,
      path: "another-svg-path",
      rotation: 0,
      scale: 1,
      strokeColor: "black",
      strokeOpacity: 1,
      strokeWeight: 1,
    });
  });
});

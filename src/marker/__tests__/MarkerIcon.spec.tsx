import { mount } from "enzyme";
import * as React from "react";

import { GoogleMapContextProvider } from "../../google-map-context/GoogleMapContext";
import { MarkerContextProvider } from "../MarkerContext";
import { MarkerIcon, MarkerIconProps } from "../MarkerIcon";

describe("MarkerIcon", () => {
  const map = new google.maps.Map(null);
  const marker = new google.maps.Marker();

  function MockMarkerIcon(props: MarkerIconProps) {
    return (
      <GoogleMapContextProvider value={{ map, maps: google.maps }}>
        <MarkerContextProvider value={{ marker }}>
          <MarkerIcon {...props} />
        </MarkerContextProvider>
      </GoogleMapContextProvider>
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should set default marker icon options on mount", () => {
    mount(<MockMarkerIcon url="https://url.to/icon.png" />);

    expect(marker.setIcon).toBeCalledTimes(1);
    expect(marker.setIcon).lastCalledWith({
      anchor: undefined,
      labelOrigin: undefined,
      origin: { x: 0, y: 0 },
      scaledSize: undefined,
      size: undefined,
      url: "https://url.to/icon.png"
    });
  });

  it("should set custom marker icon options on mount", () => {
    mount(
      <MockMarkerIcon
        url="https://url.to/icon.png"
        anchor={{ x: 1, y: 2 }}
        origin={{ x: 3, y: 4 }}
        labelOrigin={{ x: 5, y: 6 }}
        size={{ width: 7, height: 8 }}
        scaledSize={{ width: 9, height: 10 }}
      />
    );

    expect(marker.setIcon).toBeCalledTimes(1);
    expect(marker.setIcon).lastCalledWith({
      anchor: { x: 1, y: 2 },
      labelOrigin: { x: 5, y: 6 },
      origin: { x: 3, y: 4 },
      scaledSize: { height: 10, width: 9 },
      size: { height: 8, width: 7 },
      url: "https://url.to/icon.png"
    });
  });

  it("should update icon only if on options change", () => {
    const wrapper = mount(<MockMarkerIcon url="https://url.to/icon.png" />);

    expect(marker.setIcon).toBeCalledTimes(1);

    wrapper.setProps({ url: "https://url.to/another-icon.png" });

    expect(marker.setIcon).toBeCalledTimes(2);
    expect(marker.setIcon).lastCalledWith({
      anchor: undefined,
      labelOrigin: undefined,
      origin: { x: 0, y: 0 },
      scaledSize: undefined,
      size: undefined,
      url: "https://url.to/another-icon.png"
    });

    wrapper.setProps({ origin: { x: 0, y: 0 } });

    expect(marker.setIcon).toBeCalledTimes(2);

    wrapper.setProps({ origin: { x: 1, y: 2 } });

    expect(marker.setIcon).toBeCalledTimes(3);

    expect(marker.setIcon).lastCalledWith({
      anchor: undefined,
      labelOrigin: undefined,
      origin: { x: 1, y: 2 },
      scaledSize: undefined,
      size: undefined,
      url: "https://url.to/another-icon.png"
    });
  });
});

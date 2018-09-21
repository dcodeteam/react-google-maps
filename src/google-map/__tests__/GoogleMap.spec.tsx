import { mount } from "enzyme";
import * as React from "react";

import {
  createMockHandlers,
  getClassMockInstance,
} from "../../__tests__/testUtils";
import { GoogleMapContextConsumer } from "../../google-map-context/GoogleMapContext";
import { forEachEvent } from "../../internal/PropsUtils";
import { GoogleMap, GoogleMapProps } from "../GoogleMap";
import { GoogleMapEvent } from "../GoogleMapEvent";

export function getMapMockInstance(): google.maps.Map {
  return getClassMockInstance(google.maps.Map);
}

describe("GoogleMap", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("#componentDidMount", () => {
    it("should attach map to child div", () => {
      const wrapper = mount(
        <GoogleMap maps={google.maps} zoom={0} center={{ lat: 0, lng: 1 }} />,
      );

      const mapDiv = wrapper.find("div > div");

      expect(mapDiv.length).toBe(1);
    });

    it("should pass default options to map", () => {
      mount(
        <GoogleMap maps={google.maps} zoom={0} center={{ lat: 0, lng: 1 }} />,
      );

      const map = getMapMockInstance();

      expect(map.setValues).toBeCalledTimes(1);
      expect(map.setValues).lastCalledWith({
        backgroundColor: undefined,
        center: { lat: 0, lng: 1 },
        clickableIcons: true,
        disableDefaultUI: true,
        disableDoubleClickZoom: false,
        mapTypeId: "ROADMAP",
        zoom: 0,
      });
    });

    it("should pass custom options to map", () => {
      mount(
        <GoogleMap
          maps={google.maps}
          zoom={0}
          center={{ lat: 0, lng: 1 }}
          mapTypeId="HYBRID"
          clickableIcons={false}
          disableDoubleClickZoom={true}
        />,
      );

      const map = getMapMockInstance();

      expect(map.setValues).toBeCalledTimes(1);
      expect(map.setValues).lastCalledWith({
        backgroundColor: undefined,
        center: { lat: 0, lng: 1 },
        clickableIcons: false,
        disableDefaultUI: true,
        disableDoubleClickZoom: true,
        mapTypeId: "HYBRID",
        zoom: 0,
      });
    });

    it("should add all event listeners", () => {
      mount(
        <GoogleMap zoom={0} maps={google.maps} center={{ lat: 0, lng: 1 }} />,
      );

      const map = getMapMockInstance();

      expect(map.addListener).toBeCalledTimes(
        Object.keys(GoogleMapEvent).length,
      );
    });

    it("should add listeners with handlers", () => {
      const handlers = createMockHandlers<GoogleMapProps>(GoogleMapEvent);
      const zoom = 10;

      mount(
        <GoogleMap
          {...handlers}
          zoom={zoom}
          maps={google.maps}
          center={{ lat: 0, lng: 1 }}
        />,
      );

      const map = getMapMockInstance();

      forEachEvent<GoogleMapProps>(GoogleMapEvent, (key, event) => {
        const handler = handlers[key];
        const payload = { key, event };

        expect(handler).toBeCalledTimes(0);

        // eslint-disable-next-line typescript/no-explicit-any
        (map as any).emit(event, payload);

        expect(handler).toBeCalledTimes(1);

        if (event === GoogleMapEvent.onZoomChanged) {
          expect(handler).lastCalledWith({ zoom });
        } else if (event === GoogleMapEvent.onBoundsChanged) {
          expect(handler).lastCalledWith({ bounds: [] });
        } else {
          expect(handler).lastCalledWith(payload);
        }
      });
    });
  });

  describe("#componentDidUpdate", () => {
    it("pass only changed options to map", () => {
      const wrapper = mount(
        <GoogleMap maps={google.maps} zoom={0} center={{ lat: 0, lng: 1 }} />,
      );

      const map = getMapMockInstance();

      expect(map.setOptions).toBeCalledTimes(1);

      wrapper.setProps({ zoom: 1 });

      expect(map.setOptions).toBeCalledTimes(2);
      expect(map.setOptions).lastCalledWith({ zoom: 1 });

      wrapper.setProps({ zoom: 1 });

      expect(map.setOptions).toBeCalledTimes(2);

      wrapper.setProps({ zoom: 2 });

      expect(map.setOptions).toBeCalledTimes(3);

      expect(map.setOptions).lastCalledWith({ zoom: 2 });
    });
  });

  describe("#componentWillUnmount", () => {
    it("should remove all listeners on unmount", () => {
      const wrapper = mount(
        <GoogleMap maps={google.maps} zoom={0} center={{ lat: 0, lng: 1 }} />,
      );

      const mapDiv = wrapper.find("div > div");

      expect(google.maps.event.clearInstanceListeners).toBeCalledTimes(0);

      wrapper.unmount();

      expect(google.maps.event.clearInstanceListeners).toBeCalledTimes(1);
      expect(google.maps.event.clearInstanceListeners).lastCalledWith(
        mapDiv.getDOMNode(),
      );
    });
  });

  describe("#render", () => {
    it("should pass context", () => {
      const consumer = jest.fn();

      mount(
        <GoogleMap maps={google.maps} zoom={0} center={{ lat: 0, lng: 1 }}>
          <GoogleMapContextConsumer>{consumer}</GoogleMapContextConsumer>
        </GoogleMap>,
      );

      const map = getMapMockInstance();

      expect(consumer).toBeCalledTimes(1);
      expect(consumer).toBeCalledWith({ maps: google.maps, map });
    });
  });
});

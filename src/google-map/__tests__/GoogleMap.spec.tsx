import { mount } from "enzyme";
import * as React from "react";

import { GoogleMapContextConsumer } from "../../google-map-context/GoogleMapContext";
import { GoogleMap, GoogleMapProps } from "../GoogleMap";

const eventHandlerPairs: Array<[keyof GoogleMapProps, string]> = [
  ["onClick", "click"],
  ["onDoubleClick", "dblclick"],
  ["onRightClick", "rightclick"],

  ["onMouseOut", "mouseout"],
  ["onMouseOver", "mouseover"],

  ["onMouseMove", "mousemove"],

  ["onDrag", "drag"],
  ["onDragStart", "dragstart"],
  ["onDragEnd", "dragend"],

  ["onIdle", "idle"],
  ["onTilesLoaded", "tilesloaded"],
  ["onTiltChanged", "tilt_changed"],
  ["onZoomChanged", "zoom_changed"],
  ["onBoundsChanged", "bounds_changed"],
  ["onCenterChanged", "center_changed"],
  ["onHeadingChanged", "heading_changed"],
  ["onMapTypeIdChanged", "maptypeid_changed"],
  ["onProjectionChanged", "projection_changed"]
];

const { Map: GoogleMapsMap } = google.maps;

function mockMap() {
  return jest
    .spyOn(google.maps, "Map")
    .mockImplementation((node, options) => new GoogleMapsMap(node, options));
}

describe("GoogleMap", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("#componentDidMount", () => {
    it("should attach map to child div", () => {
      const wrapper = mount(
        <GoogleMap maps={google.maps} zoom={0} center={{ lat: 0, lng: 1 }} />
      );

      const mapDiv = wrapper.find("div > div");

      expect(mapDiv.length).toBe(1);
    });

    it("should pass default options to map", () => {
      const mapSpy = mockMap();

      mount(
        <GoogleMap maps={google.maps} zoom={0} center={{ lat: 0, lng: 1 }} />
      );

      expect(mapSpy.mock.calls).toMatchSnapshot("calls");
    });

    it("should pass custom options to map", () => {
      const mapSpy = mockMap();

      mount(
        <GoogleMap
          maps={google.maps}
          zoom={0}
          center={{ lat: 0, lng: 1 }}
          mapTypeId="HYBRID"
          clickableIcons={false}
          disableDoubleClickZoom={true}
        />
      );

      expect(mapSpy.mock.calls).toMatchSnapshot("calls");
    });

    it("should add all event listeners", () => {
      const mapSpy = mockMap();

      mount(
        <GoogleMap zoom={0} maps={google.maps} center={{ lat: 0, lng: 1 }} />
      );

      expect(mapSpy.mock.results[0]).toMatchSnapshot();
    });

    it("should add listeners with handlers", () => {
      const handlers = eventHandlerPairs.reduce<Partial<GoogleMapProps>>(
        (acc, [prop]) => {
          acc[prop] = jest.fn();

          return acc;
        },
        {}
      );

      const mapSpy = mockMap();

      const zoom = 10;

      mount(
        <GoogleMap
          zoom={zoom}
          maps={google.maps}
          center={{ lat: 0, lng: 1 }}
          {...handlers}
        />
      );

      const [{ value: instance }] = mapSpy.mock.results;

      eventHandlerPairs.forEach(([prop, event]) => {
        const handler = handlers[prop];
        const payload = { prop, event };

        expect(handler).toBeCalledTimes(0);

        instance.emit(event, payload);

        expect(handler).toBeCalledTimes(1);

        switch (prop) {
          case "onZoomChanged":
            expect(handler).lastCalledWith({ zoom });
            break;

          case "onBoundsChanged":
            expect(handler).lastCalledWith({ bounds: [] });
            break;

          default:
            expect(handler).lastCalledWith(payload);
        }
      });
    });
  });

  describe("#componentDidUpdate", () => {
    it("pass only changed options to map", () => {
      const mapSpy = mockMap();
      const wrapper = mount(
        <GoogleMap maps={google.maps} zoom={0} center={{ lat: 0, lng: 1 }} />
      );

      const [{ value: instance }] = mapSpy.mock.results;

      const setValuesSpy = jest.spyOn(instance, "setValues");

      wrapper.setProps({ disableDoubleClickZoom: true });

      expect(setValuesSpy).toBeCalledTimes(1);
      expect(setValuesSpy).toHaveBeenLastCalledWith({
        disableDoubleClickZoom: true
      });

      wrapper.setProps({
        disableDoubleClickZoom: true
      });

      expect(setValuesSpy).toBeCalledTimes(1);

      wrapper.setProps({
        clickableIcons: true
      });

      expect(setValuesSpy).toBeCalledTimes(2);

      expect(setValuesSpy).toHaveBeenLastCalledWith({
        clickableIcons: true
      });
    });
  });

  describe("#componentWillUnmount", () => {
    it("should remove all listeners on unmount", () => {
      const spy = jest.spyOn(google.maps.event, "clearInstanceListeners");

      const wrapper = mount(
        <GoogleMap maps={google.maps} zoom={0} center={{ lat: 0, lng: 1 }} />
      );

      const mapDiv = wrapper.find("div > div");

      expect(spy).toHaveBeenCalledTimes(0);

      wrapper.unmount();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith(mapDiv.getDOMNode());
    });
  });

  describe("#render", () => {
    it("should pass context", () => {
      const consumer = jest.fn();
      const mapSpy = mockMap();

      mount(
        <GoogleMap maps={google.maps} zoom={0} center={{ lat: 0, lng: 1 }}>
          <GoogleMapContextConsumer>{consumer}</GoogleMapContextConsumer>
        </GoogleMap>
      );

      const [{ value: instance }] = mapSpy.mock.results;

      expect(consumer).toBeCalledTimes(1);
      expect(consumer).toBeCalledWith({ maps: google.maps, map: instance });
    });
  });
});

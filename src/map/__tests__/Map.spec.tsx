import { mount, shallow } from "enzyme";
import * as React from "react";

import {
  createMockHandlers,
  emitEvent,
  forEachEvent,
  getClassMockInstance,
} from "../../__tests__/testUtils";
import { GoogleMapProps, Map } from "../Map";
import { MapContextConsumer } from "../MapContext";
import { MapEvent } from "../MapEvent";

export function getMockInstance(): google.maps.Map {
  return getClassMockInstance(google.maps.Map);
}

describe("Map", () => {
  const instanceEvents = Object.keys(MapEvent).length;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should attach map to child div", () => {
    const wrapper = shallow(
      <Map maps={google.maps} zoom={0} center={{ lat: 0, lng: 1 }} />,
    );

    const mapDiv = wrapper.find("div");

    expect(mapDiv.length).toBe(1);
  });

  it("should pass default options to map", () => {
    shallow(<Map maps={google.maps} zoom={0} center={{ lat: 0, lng: 1 }} />);

    const map = getMockInstance();

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
    shallow(
      <Map
        maps={google.maps}
        zoom={0}
        center={{ lat: 0, lng: 1 }}
        mapTypeId="HYBRID"
        clickableIcons={false}
        disableDoubleClickZoom={true}
      />,
    );

    const map = getMockInstance();

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
    mount(<Map zoom={0} maps={google.maps} center={{ lat: 0, lng: 1 }} />);

    const map = getMockInstance();

    expect(map.addListener).toBeCalledTimes(instanceEvents);
  });

  it("should add listeners with handlers", () => {
    const handlers = createMockHandlers<GoogleMapProps>(MapEvent);
    const zoom = 10;

    mount(
      <Map
        {...handlers}
        zoom={zoom}
        maps={google.maps}
        center={{ lat: 0, lng: 1 }}
      />,
    );

    const map = getMockInstance();

    forEachEvent<GoogleMapProps>(MapEvent, (key, event) => {
      const handler = handlers[key];
      const payload = { key, event };

      expect(handler).toBeCalledTimes(0);

      emitEvent(map, event, payload);

      expect(handler).toBeCalledTimes(1);

      if (event === MapEvent.onZoomChanged) {
        expect(handler).lastCalledWith({ zoom });
      } else if (event === MapEvent.onBoundsChanged) {
        expect(handler).lastCalledWith({ bounds: map.getBounds()!.toJSON() });
      } else {
        expect(handler).lastCalledWith(payload);
      }
    });
  });

  it("pass only changed options to map", () => {
    const wrapper = shallow(
      <Map maps={google.maps} zoom={0} center={{ lat: 0, lng: 1 }} />,
    );

    const map = getMockInstance();

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

  it("should remove all listeners on unmount", () => {
    const wrapper = mount(
      <Map maps={google.maps} zoom={0} center={{ lat: 0, lng: 1 }} />,
    );

    const map = getMockInstance();
    const mapDiv = wrapper.find("div");
    const {
      mock: { results },
    } = map.addListener as jest.Mock;

    expect(results.length).toBe(instanceEvents);
    expect(google.maps.event.clearInstanceListeners).toBeCalledTimes(0);

    wrapper.unmount();

    results.forEach(({ value }) => {
      expect(value.remove).toBeCalled();
    });

    expect(google.maps.event.clearInstanceListeners).toBeCalledTimes(2);
    expect(google.maps.event.clearInstanceListeners).nthCalledWith(1, map);
    expect(google.maps.event.clearInstanceListeners).nthCalledWith(
      2,
      mapDiv.getDOMNode(),
    );
  });

  it("should pass context", () => {
    const consumer = jest.fn();

    mount(
      <Map maps={google.maps} zoom={0} center={{ lat: 0, lng: 1 }}>
        <MapContextConsumer>{consumer}</MapContextConsumer>
      </Map>,
    );

    const map = getMockInstance();

    expect(consumer).toBeCalledTimes(1);
    expect(consumer).toBeCalledWith({ maps: google.maps, map });
  });
});

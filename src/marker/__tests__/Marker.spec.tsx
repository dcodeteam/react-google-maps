import { mount } from "enzyme";
import * as React from "react";

import {
  createMockHandlers,
  getClassMockInstance,
} from "../../__tests__/testUtils";
import { GoogleMapContextProvider } from "../../google-map-context/GoogleMapContext";
import { forEachEvent } from "../../internal/PropsUtils";
import { Marker, MarkerProps } from "../Marker";
import { MarkerContextConsumer } from "../MarkerContext";
import { MarkerEvent } from "../MarkerEvent";

const map = new google.maps.Map(null);

export function getMarkerMockInstance(): google.maps.Marker {
  return getClassMockInstance(google.maps.Marker);
}

function MockMarker(props: MarkerProps) {
  return (
    <GoogleMapContextProvider value={{ map, maps: google.maps }}>
      <Marker {...props} />
    </GoogleMapContextProvider>
  );
}

describe("Marker", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create marker and attach it to map on mount", () => {
    mount(<MockMarker position={{ lat: 0, lng: 1 }} />);

    const marker = getMarkerMockInstance();

    expect(marker.setMap).toBeCalledTimes(1);
    expect(marker.setMap).toHaveBeenLastCalledWith(map);
  });

  it("should set default options on mount", () => {
    mount(<MockMarker position={{ lat: 0, lng: 1 }} />);

    const marker = getMarkerMockInstance();

    expect(marker.setOptions).toBeCalledTimes(1);
    expect(marker.setOptions).lastCalledWith({
      animation: undefined,
      clickable: undefined,
      cursor: undefined,
      draggable: undefined,
      icon: undefined,
      label: undefined,
      opacity: undefined,
      optimized: undefined,
      position: { lat: 0, lng: 1 },
      shape: undefined,
      title: undefined,
      visible: undefined,
      zIndex: undefined,
    });
  });

  it("should set custom options on mount", () => {
    mount(
      <MockMarker
        animation="BOUNCE"
        clickable={true}
        cursor="pointer"
        draggable={true}
        icon="https://url.to/icon.png"
        label="A"
        opacity={0.5}
        optimized={false}
        position={{ lat: 0, lng: 1 }}
        shape={{ type: "foo" }}
        title="Foo"
        visible={false}
        zIndex={1000}
      />,
    );

    const marker = getMarkerMockInstance();

    expect(marker.setOptions).toBeCalledTimes(1);
    expect(marker.setOptions).lastCalledWith({
      animation: "BOUNCE",
      clickable: true,
      cursor: "pointer",
      draggable: true,
      icon: "https://url.to/icon.png",
      label: "A",
      opacity: 0.5,
      optimized: false,
      position: { lat: 0, lng: 1 },
      shape: { type: "foo" },
      title: "Foo",
      visible: false,
      zIndex: 1000,
    });
  });

  it("should add listeners without handlers", () => {
    mount(<MockMarker position={{ lat: 0, lng: 1 }} />);

    const marker = getMarkerMockInstance();
    const eventsLength = Object.keys(MarkerEvent).length;

    expect(marker.addListener).toBeCalledTimes(eventsLength);
  });

  it("should add listeners with handlers", () => {
    const handlers = createMockHandlers(MarkerEvent);

    mount(<MockMarker position={{ lat: 0, lng: 1 }} {...handlers} />);

    const marker = getMarkerMockInstance();

    forEachEvent(MarkerEvent, (key, event) => {
      const handler = handlers[key];
      const payload = { key, event };

      expect(handler).toBeCalledTimes(0);

      // eslint-disable-next-line typescript/no-explicit-any
      (marker as any).emit(event, payload);

      expect(handler).toBeCalledTimes(1);
      expect(handler).lastCalledWith(payload);
    });
  });

  it("should render icon if its valid react element", () => {
    const wrapper = mount(
      <MockMarker position={{ lat: 0, lng: 1 }} icon={<div>Foo</div>} />,
    );

    const divWrapper = wrapper.find("div");

    expect(divWrapper.length).toBe(1);
    expect(divWrapper.html()).toBe("<div>Foo</div>");
  });

  it("should pass `MarkerContext` to children", () => {
    const consumer = jest.fn();

    mount(
      <MockMarker
        position={{ lat: 0, lng: 1 }}
        icon={<MarkerContextConsumer>{consumer}</MarkerContextConsumer>}
      />,
    );

    const marker = getMarkerMockInstance();

    expect(consumer).toBeCalledTimes(1);
    expect(consumer).lastCalledWith({ marker });
  });

  it("should reset position on drag end", () => {
    const onDragEnd = jest.fn();
    const position = { lat: 0, lng: 1 };

    mount(<MockMarker position={position} onDragEnd={onDragEnd} />);

    const marker = getMarkerMockInstance();

    expect(onDragEnd).toHaveBeenCalledTimes(0);
    expect(marker.setPosition).toHaveBeenCalledTimes(0);

    // eslint-disable-next-line typescript/no-explicit-any
    (marker as any).emit(MarkerEvent.onDragEnd);

    expect(onDragEnd).toHaveBeenCalledTimes(1);
    expect(marker.setPosition).toHaveBeenCalledTimes(1);
    expect(marker.setPosition).toHaveBeenLastCalledWith(position);
  });

  it("should update only changed options on props update", () => {
    const wrapper = mount(<MockMarker position={{ lat: 0, lng: 1 }} />);
    const marker = getMarkerMockInstance();

    expect(marker.setOptions).toBeCalledTimes(1);

    wrapper.setProps({ clickable: true });

    expect(marker.setOptions).toBeCalledTimes(2);
    expect(marker.setOptions).lastCalledWith({ clickable: true });

    wrapper.setProps({ clickable: true });

    expect(marker.setOptions).toBeCalledTimes(2);

    wrapper.setProps({ clickable: false });

    expect(marker.setOptions).toBeCalledTimes(3);
    expect(marker.setOptions).lastCalledWith({ clickable: false });
  });

  it("should remove from map on unmount", () => {
    const wrapper = mount(<MockMarker position={{ lat: 0, lng: 1 }} />);

    const marker = getMarkerMockInstance();

    expect(marker.setMap).toBeCalledTimes(1);

    wrapper.unmount();

    expect(marker.setMap).toBeCalledTimes(2);
    expect(marker.setMap).lastCalledWith(null);

    expect(google.maps.event.clearInstanceListeners).toBeCalledTimes(1);
    expect(google.maps.event.clearInstanceListeners).lastCalledWith(marker);
  });
});

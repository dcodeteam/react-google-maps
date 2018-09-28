import { mount } from "enzyme";
import * as React from "react";

import {
  createMockHandlers,
  createMockMapComponent,
  emitEvent,
  forEachEvent,
  getClassMockInstance,
} from "../../__tests__/testUtils";
import { Marker } from "../Marker";
import { MarkerContextConsumer } from "../MarkerContext";
import { MarkerEvent } from "../MarkerEvent";

export function getMockInstance(): google.maps.Marker {
  return getClassMockInstance(google.maps.Marker);
}

describe("Marker", () => {
  const { map, Mock } = createMockMapComponent(Marker);

  const customEvents = 2;
  const instanceEvents = Object.keys(MarkerEvent).length;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create marker and attach it to map on mount", () => {
    mount(<Mock position={{ lat: 0, lng: 1 }} />);

    const marker = getMockInstance();

    expect(marker.setMap).toBeCalledTimes(1);
    expect(marker.setMap).toHaveBeenLastCalledWith(map);
  });

  it("should set default options on mount", () => {
    mount(<Mock position={{ lat: 0, lng: 1 }} />);

    const marker = getMockInstance();

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
      <Mock
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

    const marker = getMockInstance();

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
    mount(<Mock position={{ lat: 0, lng: 1 }} />);

    const marker = getMockInstance();

    expect(marker.addListener).toBeCalledTimes(customEvents + instanceEvents);
  });

  it("should add listeners with handlers", () => {
    const handlers = createMockHandlers(MarkerEvent);

    mount(<Mock position={{ lat: 0, lng: 1 }} {...handlers} />);

    const marker = getMockInstance();

    forEachEvent(MarkerEvent, (key, event) => {
      const handler = handlers[key];
      const payload = { key, event };

      expect(handler).toBeCalledTimes(0);

      emitEvent(marker, event, payload);

      expect(handler).toBeCalledTimes(1);
      expect(handler).lastCalledWith(payload);
    });
  });

  it("should render icon if its valid react element", () => {
    const wrapper = mount(
      <Mock position={{ lat: 0, lng: 1 }} icon={<div>Foo</div>} />,
    );

    const divWrapper = wrapper.find("div");

    expect(divWrapper.length).toBe(1);
    expect(divWrapper.html()).toBe("<div>Foo</div>");
  });

  it("should pass `MarkerContext` to children", () => {
    const consumer = jest.fn();

    mount(
      <Mock
        position={{ lat: 0, lng: 1 }}
        icon={<MarkerContextConsumer>{consumer}</MarkerContextConsumer>}
      />,
    );

    const marker = getMockInstance();

    expect(consumer).toBeCalledTimes(1);
    expect(consumer).lastCalledWith({ marker });
  });

  it("should reset position on drag end", () => {
    const onDragEnd = jest.fn();
    const position = { lat: 0, lng: 1 };

    mount(<Mock position={position} onDragEnd={onDragEnd} />);

    const marker = getMockInstance();

    expect(onDragEnd).toHaveBeenCalledTimes(0);
    expect(marker.setPosition).toHaveBeenCalledTimes(0);

    emitEvent(marker, MarkerEvent.onDragEnd);

    expect(onDragEnd).toHaveBeenCalledTimes(1);
    expect(marker.setPosition).toHaveBeenCalledTimes(1);
    expect(marker.setPosition).toHaveBeenLastCalledWith(position);
  });

  it("should update only changed options on props update", () => {
    const wrapper = mount(<Mock position={{ lat: 0, lng: 1 }} />);
    const marker = getMockInstance();

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
    const wrapper = mount(<Mock position={{ lat: 0, lng: 1 }} />);

    const marker = getMockInstance();

    expect(marker.setMap).toBeCalledTimes(1);
    expect(google.maps.event.clearInstanceListeners).toBeCalledTimes(0);

    wrapper.unmount();

    const {
      mock: { results },
    } = marker.addListener as jest.Mock;

    expect(results.length).toBe(customEvents + instanceEvents);

    results.forEach(({ value }) => {
      expect(value.remove).toBeCalled();
    });

    expect(marker.setMap).toBeCalledTimes(2);
    expect(marker.setMap).lastCalledWith(null);

    expect(google.maps.event.clearInstanceListeners).toBeCalledTimes(1);
    expect(google.maps.event.clearInstanceListeners).nthCalledWith(1, marker);
  });
});

import { mount } from "enzyme";
import * as React from "react";

import {
  createMockHandlers,
  createMockMapComponent,
  emitEvent,
  forEachEvent,
  getClassMockInstance,
} from "../../__tests__/testUtils";
import { Polyline } from "../Polyline";
import { PolylineEvent } from "../PolylineEvent";

function getMockInstance(): google.maps.Polyline {
  return getClassMockInstance(google.maps.Polyline);
}

describe("Polyline", () => {
  const { map, Mock } = createMockMapComponent(Polyline);
  const customEvents = 2;
  const instanceEvents = Object.keys(PolylineEvent).length;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create polyline and attach it to map on mount", () => {
    mount(<Mock path={[]} />);

    const polyline = getMockInstance();

    expect(polyline.setMap).toBeCalledTimes(1);
    expect(polyline.setMap).lastCalledWith(map);
  });

  it("should set default options on mount", () => {
    mount(<Mock path={[]} />);

    const polyline = getMockInstance();

    expect(polyline.setOptions).toBeCalledTimes(1);
    expect(polyline.setOptions).lastCalledWith({
      clickable: true,
      draggable: false,
      geodesic: false,
      path: { values: [] },
      strokeColor: undefined,
      strokeOpacity: undefined,
      strokeWeight: undefined,
      visible: true,
      zIndex: undefined,
    });
  });

  it("should set custom options on mount", () => {
    mount(
      <Mock
        path={[]}
        visible={false}
        clickable={false}
        draggable={true}
        strokeWeight={1}
        strokeOpacity={1}
        strokeColor="#FF0000"
      />,
    );

    const polyline = getMockInstance();

    expect(polyline.setOptions).toBeCalledTimes(1);
    expect(polyline.setOptions).lastCalledWith({
      clickable: false,
      draggable: true,
      geodesic: false,
      path: { values: [] },
      strokeColor: "#FF0000",
      strokeOpacity: 1,
      strokeWeight: 1,
      visible: false,
      zIndex: undefined,
    });
  });

  it("should add listeners without handlers", () => {
    mount(<Mock path={[]} />);

    const polyline = getMockInstance();

    expect(polyline.addListener).toBeCalledTimes(customEvents + instanceEvents);
  });

  it("should add listeners with handlers", () => {
    const handlers = createMockHandlers(PolylineEvent);

    mount(<Mock {...handlers} path={[]} />);

    const polyline = getMockInstance();

    forEachEvent(PolylineEvent, (key, event) => {
      const handler = handlers[key];
      const payload = { key, event };

      expect(handler).toBeCalledTimes(0);

      emitEvent(polyline, event, payload);

      expect(handler).toBeCalledTimes(1);
      expect(handler).lastCalledWith(payload);
    });
  });

  it("should extend event with new 'path' on drag end", () => {
    const onDragEnd = jest.fn();

    mount(<Mock path={[{ lat: 0, lng: 1 }]} onDragEnd={onDragEnd} />);

    const polyline = getMockInstance();

    expect(onDragEnd).toBeCalledTimes(0);
    expect(polyline.setPath).toBeCalledTimes(0);

    emitEvent(polyline, PolylineEvent.onDragEnd, {});

    expect(polyline.setPath).toBeCalledTimes(1);
    expect(polyline.setPath).lastCalledWith(
      new google.maps.MVCArray([{ lat: 0, lng: 1 }]),
    );

    expect(onDragEnd).toBeCalledTimes(1);
    expect(onDragEnd).lastCalledWith({
      path: [{ lat: 0, lng: 1 }],
    });
  });

  it("should update only changed options on props update", () => {
    const wrapper = mount(<Mock path={[]} />);
    const polyline = getMockInstance();

    expect(polyline.setOptions).toBeCalledTimes(1);

    wrapper.setProps({ visible: false });

    expect(polyline.setOptions).toBeCalledTimes(2);
    expect(polyline.setOptions).lastCalledWith({ visible: false });

    wrapper.setProps({ visible: false });

    expect(polyline.setOptions).toBeCalledTimes(2);

    wrapper.setProps({ visible: true });

    expect(polyline.setOptions).toBeCalledTimes(3);
    expect(polyline.setOptions).lastCalledWith({ visible: true });
  });

  it("should remove from map on unmount", () => {
    const wrapper = mount(<Mock path={[]} />);
    const polyline = getMockInstance();

    expect(polyline.setMap).toBeCalledTimes(1);
    expect(google.maps.event.clearInstanceListeners).toBeCalledTimes(0);

    const {
      mock: { results },
    } = polyline.addListener as jest.Mock;

    wrapper.unmount();

    expect(results.length).toBe(customEvents + instanceEvents);

    results.forEach(({ value }) => {
      expect(value.remove).toBeCalled();
    });

    expect(polyline.setMap).toBeCalledTimes(2);
    expect(polyline.setMap).lastCalledWith(null);

    expect(google.maps.event.clearInstanceListeners).toBeCalledTimes(1);
    expect(google.maps.event.clearInstanceListeners).lastCalledWith(polyline);
  });
});

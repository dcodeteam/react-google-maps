import { mount } from "enzyme";
import * as React from "react";

import {
  createMockHandlers,
  emitEvent,
  getClassMockInstance,
} from "../../__tests__/testUtils";
import { GoogleMapContextProvider } from "../../google-map-context/GoogleMapContext";
import { GenericEvent } from "../../internal/GenericEvent";
import { forEachEvent } from "../../internal/PropsUtils";
import { Polyline, PolylineProps } from "../Polyline";
import { PolylineEvent } from "../PolylineEvent";

function getPolylineMockInstance(): google.maps.Polyline {
  return getClassMockInstance(google.maps.Polyline);
}

describe("Polyline", () => {
  const map = new google.maps.Map(null);

  function MockPolyline(props: PolylineProps) {
    return (
      <GoogleMapContextProvider value={{ map, maps: google.maps }}>
        <Polyline {...props} />
      </GoogleMapContextProvider>
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create polyline and attach it to map on mount", () => {
    mount(<MockPolyline path={[]} />);

    const polyline = getPolylineMockInstance();

    expect(polyline.setMap).toBeCalledTimes(1);
    expect(polyline.setMap).lastCalledWith(map);
  });

  it("should set default options on mount", () => {
    mount(<MockPolyline path={[]} />);

    const polyline = getPolylineMockInstance();

    expect(polyline.setOptions).toBeCalledTimes(1);
    expect(polyline.setOptions).lastCalledWith({
      clickable: true,
      draggable: false,
      geodesic: false,
      path: [],
      strokeColor: undefined,
      strokeOpacity: undefined,
      strokeWeight: undefined,
      visible: true,
      zIndex: undefined,
    });
  });

  it("should set custom options on mount", () => {
    mount(
      <MockPolyline
        path={[]}
        visible={false}
        clickable={false}
        draggable={true}
        strokeWeight={1}
        strokeOpacity={1}
        strokeColor="#FF0000"
      />,
    );

    const polyline = getPolylineMockInstance();

    expect(polyline.setOptions).toBeCalledTimes(1);
    expect(polyline.setOptions).lastCalledWith({
      clickable: false,
      draggable: true,
      geodesic: false,
      path: [],
      strokeColor: "#FF0000",
      strokeOpacity: 1,
      strokeWeight: 1,
      visible: false,
      zIndex: undefined,
    });
  });

  it("should add listeners without handlers", () => {
    mount(<MockPolyline path={[]} />);

    const polyline = getPolylineMockInstance();

    const customEvents = 2;
    const propEvents = Object.keys(PolylineEvent).length;

    expect(polyline.addListener).toBeCalledTimes(customEvents + propEvents);
  });

  it("should add listeners with handlers", () => {
    const handlers = createMockHandlers(PolylineEvent);

    mount(<MockPolyline {...handlers} path={[]} />);

    const polyline = getPolylineMockInstance();

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

    mount(<MockPolyline path={[{ lat: 0, lng: 1 }]} onDragEnd={onDragEnd} />);

    const polyline = getPolylineMockInstance();

    expect(onDragEnd).toBeCalledTimes(0);
    expect(polyline.setPath).toBeCalledTimes(0);

    emitEvent(polyline, GenericEvent.onDragEnd, {});

    expect(polyline.setPath).toBeCalledTimes(1);
    expect(polyline.setPath).lastCalledWith([{ lat: 0, lng: 1 }]);

    expect(onDragEnd).toBeCalledTimes(1);
    expect(onDragEnd).lastCalledWith({ path: [{ lat: 0, lng: 1 }] });
  });

  it("should update only changed options on props update", () => {
    const wrapper = mount(<MockPolyline path={[]} />);
    const polyline = getPolylineMockInstance();

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
    const wrapper = mount(<MockPolyline path={[]} />);
    const polyline = getPolylineMockInstance();

    expect(polyline.setMap).toBeCalledTimes(1);
    expect(google.maps.event.clearInstanceListeners).toBeCalledTimes(0);

    wrapper.unmount();

    expect(polyline.setMap).toBeCalledTimes(2);
    expect(polyline.setMap).lastCalledWith(null);

    expect(google.maps.event.clearInstanceListeners).toBeCalledTimes(2);
    expect(google.maps.event.clearInstanceListeners).nthCalledWith(1, polyline);
    expect(google.maps.event.clearInstanceListeners).nthCalledWith(2, polyline);
  });
});

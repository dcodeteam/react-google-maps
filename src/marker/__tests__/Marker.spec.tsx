import { mount } from "enzyme";
import * as React from "react";

import { mockMarker } from "../../__tests__/testUtils";
import { GoogleMapContextProvider } from "../../google-map-context/GoogleMapContext";
import { Marker, MarkerProps } from "../Marker";
import { MarkerContextConsumer } from "../MarkerContext";
import { MarkerEvent } from "../MarkerEvent";

const map = new google.maps.Map(null);

function MockMarker(props: MarkerProps) {
  return (
    <GoogleMapContextProvider value={{ map, maps: google.maps }}>
      <Marker {...props} />
    </GoogleMapContextProvider>
  );
}

describe("Marker", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("should create marker and attach it to map on mount", () => {
    const markerSpy = mockMarker();

    mount(<MockMarker position={{ lat: 0, lng: 1 }} />);

    expect(markerSpy).toBeCalledTimes(1);

    const [{ value: marker }] = markerSpy.mock.results;

    expect(marker.setMap).toBeCalledTimes(1);
    expect(marker.setMap).toHaveBeenLastCalledWith(map);
  });

  it("should set default options on mount", () => {
    const markerSpy = mockMarker();

    mount(<MockMarker position={{ lat: 0, lng: 1 }} />);

    const [{ value: marker }] = markerSpy.mock.results;

    expect(marker.setOptions.mock.calls).toMatchSnapshot();
  });

  it("should set custom options on mount", () => {
    const markerSpy = mockMarker();

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
        position={{
          lat: 0,
          lng: 1
        }}
        shape={{
          type: "foo"
        }}
        title="Foo"
        zIndex={1000}
        visible={false}
      />
    );

    const [{ value: marker }] = markerSpy.mock.results;

    expect(marker.setOptions.mock.calls).toMatchSnapshot();
  });

  it("should add listeners without handlers", () => {
    const markerSpy = mockMarker();

    mount(<MockMarker position={{ lat: 0, lng: 1 }} />);

    const [{ value: marker }] = markerSpy.mock.results;

    expect(marker.addListener.mock.calls).toMatchSnapshot();
  });

  it("should add listeners with handlers", () => {
    const markerSpy = mockMarker();
    const props: MarkerProps = { position: { lat: 0, lng: 1 } };
    const keys = Object.keys(MarkerEvent) as Array<keyof MarkerProps>;

    keys.forEach(key => {
      props[key] = jest.fn();
    });

    mount(<MockMarker {...props} />);

    const [{ value: marker }] = markerSpy.mock.results;

    keys.forEach(key => {
      const event = MarkerEvent[key as keyof typeof MarkerEvent];
      const handler = props[key];
      const payload = { key, event };

      expect(handler).toBeCalledTimes(0);

      marker.emit(event, payload);

      expect(handler).toBeCalledTimes(1);
      expect(handler).lastCalledWith(payload);
    });
  });

  it("should render icon if its valid react element", () => {
    const wrapper = mount(
      <MockMarker position={{ lat: 0, lng: 1 }} icon={<div>Foo</div>} />
    );

    const divWrapper = wrapper.find("div");

    expect(divWrapper.length).toBe(1);
    expect(divWrapper.html()).toBe("<div>Foo</div>");
  });

  it("should pass `MarkerContext` to children", () => {
    const consumer = jest.fn();
    const markerSpy = mockMarker();

    mount(
      <MockMarker
        position={{ lat: 0, lng: 1 }}
        icon={<MarkerContextConsumer>{consumer}</MarkerContextConsumer>}
      />
    );

    const [{ value: marker }] = markerSpy.mock.results;

    expect(consumer).toBeCalledTimes(1);
    expect(consumer).lastCalledWith({ marker });
  });

  it("should reset position on drag end", () => {
    const onDragEnd = jest.fn();
    const markerSpy = mockMarker();
    const position = { lat: 0, lng: 1 };

    mount(<MockMarker position={position} onDragEnd={onDragEnd} />);

    const [{ value: marker }] = markerSpy.mock.results;

    expect(onDragEnd).toHaveBeenCalledTimes(0);
    expect(marker.setPosition).toHaveBeenCalledTimes(0);

    marker.emit(MarkerEvent.onDragEnd);

    expect(onDragEnd).toHaveBeenCalledTimes(1);
    expect(marker.setPosition).toHaveBeenCalledTimes(1);
    expect(marker.setPosition).toHaveBeenLastCalledWith(position);
  });

  it("should update only changed options on props update", () => {
    const markerSpy = mockMarker();
    const wrapper = mount(<MockMarker position={{ lat: 0, lng: 1 }} />);

    const [{ value: marker }] = markerSpy.mock.results;

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
    const markerSpy = mockMarker();
    const wrapper = mount(<MockMarker position={{ lat: 0, lng: 1 }} />);

    const [{ value: marker }] = markerSpy.mock.results;

    expect(marker.setMap).toBeCalledTimes(1);

    wrapper.unmount();

    expect(marker.setMap).toBeCalledTimes(2);
    expect(marker.setMap).lastCalledWith(null);

    expect(google.maps.event.clearInstanceListeners).toBeCalledTimes(1);
    expect(google.maps.event.clearInstanceListeners).lastCalledWith(marker);
  });
});

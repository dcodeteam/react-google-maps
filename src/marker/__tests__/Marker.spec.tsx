import React from "react";
import { cleanup, flushEffects, render } from "react-testing-library";

import { initMapMockComponent } from "../../__testutils__/testContext";
import { getClassMockInstance, getFnMock } from "../../__testutils__/testUtils";
import { GoogleMapMarkerContext } from "../../context/GoogleMapsContext";
import { Marker } from "../Marker";
import { MarkerEvent } from "../MarkerEvent";

export function getMockInstance(maps: typeof google.maps): google.maps.Marker {
  return getClassMockInstance(maps.Marker);
}

const [Mock, ctx] = initMapMockComponent(Marker);

afterEach(cleanup);

it("mounts and unmouts", () => {
  const { map, maps } = ctx;
  const { unmount } = render(<Mock position={{ lat: 1, lng: 2 }} />);

  const marker = getMockInstance(maps);

  expect(marker.setMap).toBeCalledTimes(0);

  flushEffects();

  expect(marker.setMap).toBeCalledTimes(1);
  expect(marker.setMap).lastCalledWith(map);

  unmount();

  expect(marker.setMap).toBeCalledTimes(2);
  expect(marker.setMap).lastCalledWith(null);
});

it("passes props to marker", () => {
  const { maps } = ctx;
  const { rerender } = render(
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
  const markerMock = getFnMock(maps.Marker);
  const marker = getMockInstance(maps);
  const setOptionsMock = getFnMock(marker.setOptions);

  expect(markerMock).toBeCalledTimes(1);
  expect(markerMock.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "animation": "BOUNCE",
  "clickable": true,
  "cursor": "pointer",
  "draggable": true,
  "icon": "https://url.to/icon.png",
  "label": "A",
  "opacity": 0.5,
  "optimized": false,
  "position": LatLng {
    "latitude": 0,
    "longitude": 1,
  },
  "shape": Object {
    "type": "foo",
  },
  "title": "Foo",
  "visible": false,
  "zIndex": 1000,
}
`);

  flushEffects();

  expect(setOptionsMock).toBeCalledTimes(0);

  rerender(<Mock position={{ lat: 2, lng: 3 }} title="Bar" />);

  flushEffects();

  expect(setOptionsMock).toBeCalledTimes(1);
  expect(setOptionsMock.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "animation": undefined,
  "clickable": undefined,
  "cursor": undefined,
  "draggable": undefined,
  "label": undefined,
  "opacity": undefined,
  "optimized": undefined,
  "position": LatLng {
    "latitude": 2,
    "longitude": 3,
  },
  "shape": undefined,
  "title": "Bar",
  "visible": undefined,
  "zIndex": undefined,
}
`);
});

it("attaches handlers", () => {
  const { maps } = ctx;
  const events = new Map(Object.entries(MarkerEvent));
  const { rerender, unmount } = render(<Mock position={{ lat: 1, lng: 2 }} />);
  const marker = getMockInstance(maps);
  const addListenerMock = getFnMock(marker.addListener);

  expect(addListenerMock).toBeCalledTimes(0);

  flushEffects();

  expect(addListenerMock).toBeCalledTimes(events.size);

  const handlerProps = {
    onClick: jest.fn(),
    onDoubleClick: jest.fn(),
    onRightClick: jest.fn(),
    onMouseOut: jest.fn(),
    onMouseOver: jest.fn(),
    onMouseDown: jest.fn(),
    onMouseUp: jest.fn(),
    onDrag: jest.fn(),
    onDragStart: jest.fn(),
    onDragEnd: jest.fn(),
    onPositionChanged: jest.fn(),
  };
  const handlerMap = new Map(Object.entries(handlerProps));

  rerender(<Mock position={{ lat: 1, lng: 2 }} {...handlerProps} />);

  flushEffects();

  expect(addListenerMock).toBeCalledTimes(events.size);

  events.forEach((eventName, handlerName) => {
    const handler = handlerMap.get(handlerName);

    expect(handler).toBeCalledTimes(0);

    maps.event.trigger(marker, eventName);

    expect(handler).toBeCalledTimes(1);
  });

  rerender(<Mock position={{ lat: 1, lng: 2 }} />);

  events.forEach((eventName, handlerName) => {
    const handler = handlerMap.get(handlerName);

    maps.event.trigger(marker, eventName);

    expect(handler).toBeCalledTimes(1);
  });

  unmount();

  addListenerMock.mock.results.forEach(x => {
    expect(x.value.remove).toBeCalledTimes(1);
  });
});

it("resets marker position after drag", () => {
  const { maps } = ctx;
  const onDragEnd = jest.fn();

  render(<Mock position={{ lat: 0, lng: 1 }} onDragEnd={onDragEnd} />);

  const marker = getMockInstance(maps);

  flushEffects();

  expect(onDragEnd).toHaveBeenCalledTimes(0);
  expect(marker.setPosition).toHaveBeenCalledTimes(0);

  const position = marker.getPosition();

  maps.event.trigger(marker, MarkerEvent.onDragEnd);

  expect(onDragEnd).toHaveBeenCalledTimes(1);

  expect(marker.setPosition).toHaveBeenCalledTimes(1);
  expect(marker.setPosition).toHaveBeenLastCalledWith(position);
});

it("renders icon when it's react element", () => {
  const { maps } = ctx;
  const { container } = render(
    <Mock position={{ lat: 0, lng: 1 }} icon={<div>Foo</div>} />,
  );
  const markerMock = getFnMock(maps.Marker);

  expect(container).toMatchInlineSnapshot(`
<div>
  <div>
    Foo
  </div>
</div>
`);
  expect(markerMock).toBeCalledTimes(1);
  expect(markerMock.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "animation": undefined,
  "clickable": undefined,
  "cursor": undefined,
  "draggable": undefined,
  "label": undefined,
  "opacity": undefined,
  "optimized": undefined,
  "position": LatLng {
    "latitude": 0,
    "longitude": 1,
  },
  "shape": undefined,
  "title": undefined,
  "visible": undefined,
  "zIndex": undefined,
}
`);
});

it("passes 'GoogleMapMarkerContext'", () => {
  const { maps } = ctx;
  const consumer = jest.fn();

  render(
    <Mock
      position={{ lat: 0, lng: 1 }}
      icon={
        <GoogleMapMarkerContext.Consumer>
          {consumer}
        </GoogleMapMarkerContext.Consumer>
      }
    />,
  );

  const marker = getMockInstance(maps);

  expect(consumer).toBeCalledTimes(1);
  expect(consumer).lastCalledWith(marker);
});

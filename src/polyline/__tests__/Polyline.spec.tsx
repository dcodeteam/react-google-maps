import React from "react";
import { cleanup, flushEffects, render } from "react-testing-library";

import { initMapMockComponent } from "../../__testutils__/testContext";
import { getClassMockInstance, getFnMock } from "../../__testutils__/testUtils";
import { Polyline } from "../Polyline";
import { PolylineEvent } from "../PolylineEvent";

function getMockInstance(maps: typeof google.maps): google.maps.Polyline {
  return getClassMockInstance(maps.Polyline);
}

const [Mock, ctx] = initMapMockComponent(Polyline);

afterEach(cleanup);

it("mounts and unmouts", () => {
  const { maps, map } = ctx;
  const { unmount } = render(<Mock path={[]} />);
  const polyline = getMockInstance(maps);

  expect(polyline.setMap).toBeCalledTimes(0);

  flushEffects();

  expect(polyline.setMap).toBeCalledTimes(1);
  expect(polyline.setMap).lastCalledWith(map);

  unmount();

  expect(polyline.setMap).toBeCalledTimes(2);
  expect(polyline.setMap).lastCalledWith(null);
});

it("converts props to polyline options", () => {
  const { maps } = ctx;
  const { rerender } = render(
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
  const polyline = getMockInstance(maps);
  const polylineMock = getFnMock(maps.Polyline);
  const setOptionsMock = getFnMock(polyline.setOptions);

  expect(setOptionsMock).toBeCalledTimes(0);
  expect(polylineMock).toBeCalledTimes(1);
  expect(polylineMock.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "clickable": false,
  "draggable": true,
  "geodesic": false,
  "path": MVCArray {
    "values": Array [],
  },
  "strokeColor": "#FF0000",
  "strokeOpacity": 1,
  "strokeWeight": 1,
  "visible": false,
  "zIndex": undefined,
}
`);

  flushEffects();

  expect(setOptionsMock).toBeCalledTimes(0);

  rerender(<Mock path={[]} />);

  flushEffects();

  expect(setOptionsMock).toBeCalledTimes(1);
  expect(setOptionsMock.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "clickable": true,
  "draggable": false,
  "strokeColor": undefined,
  "strokeOpacity": undefined,
  "strokeWeight": undefined,
  "visible": true,
}
`);
});

it("attaches handlers", () => {
  const { maps } = ctx;
  const events = new Map(Object.entries(PolylineEvent));
  const { rerender, unmount } = render(<Mock path={[]} />);
  const polyline = getMockInstance(maps);
  const addListenerMock = getFnMock(polyline.addListener);

  expect(addListenerMock).toBeCalledTimes(0);

  flushEffects();

  expect(addListenerMock).toBeCalledTimes(events.size);

  const handlerProps = {
    onClick: jest.fn(),
    onDoubleClick: jest.fn(),
    onRightClick: jest.fn(),
    onMouseOut: jest.fn(),
    onMouseOver: jest.fn(),
    onMouseMove: jest.fn(),
    onMouseDown: jest.fn(),
    onMouseUp: jest.fn(),
    onDrag: jest.fn(),
    onDragStart: jest.fn(),
    onDragEnd: jest.fn(),
  };
  const handlerMap = new Map(Object.entries(handlerProps));

  rerender(<Mock path={[]} {...handlerProps} />);

  flushEffects();

  expect(addListenerMock).toBeCalledTimes(events.size);

  events.forEach((eventName, handlerName) => {
    const handler = handlerMap.get(handlerName);

    expect(handler).toBeCalledTimes(0);

    maps.event.trigger(polyline, eventName);

    expect(handler).toBeCalledTimes(1);
  });

  rerender(<Mock path={[]} />);

  events.forEach((eventName, handlerName) => {
    const handler = handlerMap.get(handlerName);

    maps.event.trigger(polyline, eventName);

    expect(handler).toBeCalledTimes(1);
  });

  unmount();

  addListenerMock.mock.results.forEach(x => {
    expect(x.value.remove).toBeCalledTimes(1);
  });
});

it("extends event with new 'path' on drag end", () => {
  const { maps } = ctx;
  const onDragEnd = jest.fn();

  render(<Mock path={[{ lat: 0, lng: 1 }]} onDragEnd={onDragEnd} />);

  const polyline = getMockInstance(maps);
  const setPathMock = getFnMock(polyline.setPath);

  flushEffects();

  expect(onDragEnd).toBeCalledTimes(0);
  expect(setPathMock).toBeCalledTimes(0);

  maps.event.trigger(polyline, PolylineEvent.onDragEnd, {});

  expect(setPathMock).toBeCalledTimes(1);
  expect(setPathMock.mock.calls[0][0]).toMatchInlineSnapshot(`
MVCArray {
  "values": Array [
    LatLng {
      "latitude": 0,
      "longitude": 1,
    },
  ],
}
`);

  expect(onDragEnd).toBeCalledTimes(1);
  expect(onDragEnd.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "path": Array [
    LatLng {
      "latitude": 0,
      "longitude": 1,
    },
  ],
}
`);
});

import React from "react";
import { cleanup, flushEffects, render } from "react-testing-library";

import { initMapMockComponent } from "../../__testutils__/testContext";
import { getClassMockInstance, getFnMock } from "../../__testutils__/testUtils";
import { DrawingControl } from "../DrawingControl";
import { DrawingControlEvent } from "../DrawingControlEvent";

function getMockInstance(
  maps: typeof google.maps,
): google.maps.drawing.DrawingManager {
  return getClassMockInstance(maps.drawing.DrawingManager);
}

const [Mock, ctx] = initMapMockComponent(DrawingControl);

afterEach(cleanup);

it("mounts and unmouts", () => {
  const { map, maps } = ctx;
  const { unmount } = render(<Mock />);

  const control = getMockInstance(maps);

  expect(control.setMap).toBeCalledTimes(0);

  flushEffects();

  expect(control.setMap).toBeCalledTimes(1);
  expect(control.setMap).lastCalledWith(map);

  unmount();

  expect(control.setMap).toBeCalledTimes(2);
  expect(control.setMap).lastCalledWith(null);
});

it("passes props", () => {
  const { maps } = ctx;
  const { rerender } = render(
    <Mock position="TOP_RIGHT" drawingModes={["POLYGON", "RECTANGLE"]} />,
  );
  const managedMock = getFnMock(maps.drawing.DrawingManager);
  const marker = getMockInstance(maps);
  const setOptionsMock = getFnMock(marker.setOptions);

  expect(managedMock).toBeCalledTimes(1);
  expect(managedMock.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "drawingControl": true,
  "drawingControlOptions": Object {
    "drawingModes": Array [
      "POLYGON",
      "RECTANGLE",
    ],
    "position": "TOP_RIGHT",
  },
}
`);

  flushEffects();

  expect(setOptionsMock).toBeCalledTimes(0);

  rerender(<Mock position="TOP_RIGHT" />);

  flushEffects();

  expect(setOptionsMock).toBeCalledTimes(1);
  expect(setOptionsMock.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "drawingControl": true,
  "drawingControlOptions": Object {
    "drawingModes": Array [
      "CIRCLE",
      "MARKER",
      "POLYGON",
      "POLYLINE",
      "RECTANGLE",
    ],
    "position": "TOP_RIGHT",
  },
}
`);
});

it("attaches handlers", () => {
  const { maps } = ctx;
  const events = new Map(Object.entries(DrawingControlEvent));
  const { rerender, unmount } = render(<Mock />);
  const marker = getMockInstance(maps);
  const addListenerMock = getFnMock(marker.addListener);

  expect(addListenerMock).toBeCalledTimes(0);

  flushEffects();

  expect(addListenerMock).toBeCalledTimes(events.size);

  expect(() => {
    events.forEach(eventName => {
      maps.event.trigger(marker, eventName, { overlay: { setMap: jest.fn() } });
    });
  }).not.toThrow();

  const handlers = {
    onCircleComplete: jest.fn(),
    onMarkerComplete: jest.fn(),
    onOverlayComplete: jest.fn(),
    onPolygonComplete: jest.fn(),
    onPolylineComplete: jest.fn(),
    onRectangleComplete: jest.fn(),
  };

  rerender(<Mock {...handlers} />);

  flushEffects();

  expect(addListenerMock).toBeCalledTimes(events.size);

  const listeners = addListenerMock.mock.calls.reduce(
    (acc, [event, fn]) => acc.set(event, fn),
    new Map(),
  );

  expect(listeners.size).toBe(events.size);

  events.forEach((eventName, handlerName) => {
    const handler = handlers[handlerName as keyof typeof handlers];
    const listener = listeners.get(eventName);
    const payload = { handlerName, eventName, overlay: { setMap: jest.fn() } };

    expect(handler).toBeCalledTimes(0);

    listener(payload);

    expect(handler).toBeCalledTimes(1);
    expect(handler).lastCalledWith(payload);
  });

  events.forEach((_, handlerName) => {
    const handler = handlers[handlerName as keyof typeof handlers];

    expect(handler).toBeCalledTimes(1);
  });

  unmount();

  addListenerMock.mock.results.forEach(x => {
    expect(x.value.remove).toBeCalledTimes(1);
  });
});

it("unsets map from overlay onOverlayComplete", () => {
  const { maps } = ctx;

  const setMapMock = jest.fn();

  const { rerender } = render(<Mock />);

  const manager = getMockInstance(maps);
  const event = { overlay: { setMap: setMapMock } };

  flushEffects();

  expect(() => {
    maps.event.trigger(manager, DrawingControlEvent.onOverlayComplete, event);
  }).not.toThrow();

  expect(setMapMock).toBeCalledTimes(1);
  expect(setMapMock).lastCalledWith(null);

  const onOverlayCompleteMock = jest.fn();

  rerender(<Mock onOverlayComplete={onOverlayCompleteMock} />);

  expect(() => {
    maps.event.trigger(manager, DrawingControlEvent.onOverlayComplete, event);
  }).not.toThrow();

  expect(setMapMock).toBeCalledTimes(2);
  expect(setMapMock).lastCalledWith(null);

  expect(onOverlayCompleteMock).toBeCalledTimes(1);
  expect(onOverlayCompleteMock).lastCalledWith(event);
});

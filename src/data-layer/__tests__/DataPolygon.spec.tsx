import React from "react";
import { cleanup, flushEffects, render } from "react-testing-library";

import { initMapMockComponent } from "../../__testutils__/testContext";
import { getClassMockInstance, getFnMock } from "../../__testutils__/testUtils";
import { DataLayerEvent } from "../DataLayerEvent";
import { DataPolygon } from "../DataPolygon";

function getMockInstance(maps: typeof google.maps): google.maps.Data.Feature {
  return getClassMockInstance(maps.Data.Feature);
}

const [Mock, ctx] = initMapMockComponent(DataPolygon);

afterEach(cleanup);

it("mounts and unmounts", () => {
  const { map, maps } = ctx;
  const { unmount } = render(<Mock geometry={[]} />);
  const feature = getMockInstance(maps);
  const addMock = getFnMock(map.data.add);
  const removeMock = getFnMock(map.data.remove);

  expect(addMock).toBeCalledTimes(0);
  expect(removeMock).toBeCalledTimes(0);

  flushEffects();

  expect(addMock).toBeCalledTimes(1);
  expect(addMock).lastCalledWith(feature);
  expect(removeMock).toBeCalledTimes(0);

  unmount();

  expect(addMock).toBeCalledTimes(1);
  expect(removeMock).toBeCalledTimes(1);
  expect(removeMock).lastCalledWith(feature);
});

it("passes 'polygon'", () => {
  const { maps } = ctx;
  const { rerender } = render(<Mock geometry={[[{ lat: 1, lng: 2 }]]} />);
  const feature = getMockInstance(maps);
  const setGeometryMock = getFnMock(feature.setGeometry);

  expect(setGeometryMock).toBeCalledTimes(0);

  flushEffects();

  expect(setGeometryMock).toBeCalledTimes(1);
  expect(setGeometryMock.mock.calls[0][0]).toMatchInlineSnapshot(`
DataPolygon {
  "values": Object {
    "array": Array [
      Array [
        Object {
          "lat": 1,
          "lng": 2,
        },
      ],
    ],
  },
}
`);

  rerender(<Mock geometry={[[{ lat: 1, lng: 2 }, { lat: 3, lng: 4 }]]} />);

  flushEffects();

  expect(setGeometryMock).toBeCalledTimes(2);
  expect(setGeometryMock.mock.calls[1][0]).toMatchInlineSnapshot(`
DataPolygon {
  "values": Object {
    "array": Array [
      Array [
        Object {
          "lat": 1,
          "lng": 2,
        },
        Object {
          "lat": 3,
          "lng": 4,
        },
      ],
    ],
  },
}
`);

  rerender(<Mock geometry={[[{ lat: 1, lng: 2 }, { lat: 3, lng: 4 }]]} />);

  flushEffects();

  expect(setGeometryMock).toBeCalledTimes(2);

  rerender(<Mock geometry={[[{ lat: 3, lng: 4 }, { lat: 5, lng: 6 }]]} />);

  flushEffects();

  expect(setGeometryMock).toBeCalledTimes(3);
  expect(setGeometryMock.mock.calls[2][0]).toMatchInlineSnapshot(`
DataPolygon {
  "values": Object {
    "array": Array [
      Array [
        Object {
          "lat": 3,
          "lng": 4,
        },
        Object {
          "lat": 5,
          "lng": 6,
        },
      ],
    ],
  },
}
`);
});

it("passes style props", () => {
  const { map, maps } = ctx;
  const overrideStyleMock = getFnMock(map.data.overrideStyle);
  const { rerender } = render(
    <Mock
      geometry={[]}
      clickable={false}
      fillColor="#000000"
      fillOpacity={0.4}
      strokeColor="#000000"
      strokeOpacity={1}
      strokeWeight={3}
    />,
  );

  const feature = getMockInstance(maps);

  expect(overrideStyleMock).toBeCalledTimes(0);

  flushEffects();

  expect(overrideStyleMock).toBeCalledTimes(1);
  expect(overrideStyleMock.mock.calls[0][0]).toBe(feature);
  expect(overrideStyleMock.mock.calls[0][1]).toMatchInlineSnapshot(`
Object {
  "clickable": false,
  "fillColor": "#000000",
  "fillOpacity": 0.4,
  "strokeColor": "#000000",
  "strokeOpacity": 1,
  "strokeWeight": 3,
  "zIndex": undefined,
}
`);

  rerender(<Mock geometry={[]} />);

  flushEffects();

  expect(overrideStyleMock).toBeCalledTimes(2);
  expect(overrideStyleMock.mock.calls[1][0]).toBe(feature);
  expect(overrideStyleMock.mock.calls[1][1]).toMatchInlineSnapshot(`
Object {
  "clickable": true,
  "fillColor": undefined,
  "fillOpacity": undefined,
  "strokeColor": undefined,
  "strokeOpacity": undefined,
  "strokeWeight": undefined,
  "zIndex": undefined,
}
`);
});

it("attaches handlers", () => {
  const { map, maps } = ctx;
  const events = new Map(Object.entries(DataLayerEvent));
  const { rerender, unmount } = render(<Mock geometry={[]} />);
  const feature = getMockInstance(maps);
  const addListenerMock = getFnMock(map.data.addListener);

  expect(addListenerMock).toBeCalledTimes(0);

  flushEffects();

  expect(addListenerMock).toBeCalledTimes(events.size);

  expect(() => {
    events.forEach(eventName => {
      maps.event.trigger(map.data, eventName, { feature });
    });
  }).not.toThrow();

  const handlers = {
    onClick: jest.fn(),
    onDoubleClick: jest.fn(),
    onRightClick: jest.fn(),
    onMouseOut: jest.fn(),
    onMouseOver: jest.fn(),
    onMouseDown: jest.fn(),
    onMouseUp: jest.fn(),
  };

  rerender(<Mock {...handlers} geometry={[]} />);

  flushEffects();

  expect(addListenerMock).toBeCalledTimes(events.size);

  events.forEach((eventName, handlerName) => {
    const handler = handlers[handlerName as keyof typeof handlers];

    expect(handler).toBeCalledTimes(0);

    maps.event.trigger(map.data, eventName, { feature: {} });

    expect(handler).toBeCalledTimes(0);

    maps.event.trigger(map.data, eventName, { feature });

    expect(handler).toBeCalledTimes(1);
    expect(handler).lastCalledWith({ feature });
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

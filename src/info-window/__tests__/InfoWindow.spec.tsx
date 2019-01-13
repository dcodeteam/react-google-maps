import React from "react";
import { cleanup, flushEffects, render } from "react-testing-library";

import { initMapMockComponent } from "../../__testutils__/testContext";
import { getClassMockInstance, getFnMock } from "../../__testutils__/testUtils";
import { InfoWindow } from "../InfoWindow";
import { InfoWindowEvent } from "../InfoWindowEvent";

function getMockInstance(maps: typeof google.maps): google.maps.InfoWindow {
  return getClassMockInstance(maps.InfoWindow);
}

const [Mock, ctx] = initMapMockComponent(InfoWindow);

afterEach(cleanup);

it("mounts and unmounts", () => {
  const { map, maps } = ctx;
  const { unmount } = render(
    <Mock position={{ lat: 0, lng: 1 }}>Content</Mock>,
  );

  const infoWindow = getMockInstance(maps);

  expect(infoWindow.open).toBeCalledTimes(0);
  expect(infoWindow.close).toBeCalledTimes(0);

  flushEffects();

  expect(infoWindow.open).toBeCalledTimes(1);
  expect(infoWindow.open).lastCalledWith(map);
  expect(infoWindow.close).toBeCalledTimes(0);

  unmount();

  expect(infoWindow.open).toBeCalledTimes(1);
  expect(infoWindow.close).toBeCalledTimes(1);
});

it("passes props", () => {
  const { rerender } = render(
    <Mock position={{ lat: 0, lng: 1 }}>Content</Mock>,
  );

  const infoWindow = getMockInstance(ctx.maps);
  const infoWindowMock = getFnMock(ctx.maps.InfoWindow);
  const setOptionsMock = getFnMock(infoWindow.setOptions);

  expect(infoWindowMock).toBeCalledTimes(1);
  expect(infoWindowMock.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "content": "Content",
  "disableAutoPan": false,
  "maxWidth": undefined,
  "pixelOffset": undefined,
  "position": LatLng {
    "latitude": 0,
    "longitude": 1,
  },
  "zIndex": undefined,
}
`);

  rerender(
    <Mock
      maxWidth={120}
      zIndex={10}
      disableAutoPan={true}
      position={{ lat: 0, lng: 1 }}
      pixelOffset={{ width: 0, height: 1 }}
    >
      Another Content
    </Mock>,
  );

  flushEffects();

  expect(setOptionsMock).toBeCalledTimes(1);
  expect(setOptionsMock.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "content": "Another Content",
  "disableAutoPan": true,
  "maxWidth": 120,
  "pixelOffset": Size {
    "height": 1,
    "width": 0,
  },
  "zIndex": 10,
}
`);
});

it("re-triggers open on maxWidth change", () => {
  const { rerender } = render(
    <Mock position={{ lat: 0, lng: 1 }}>Content</Mock>,
  );

  const infoWindow = getMockInstance(ctx.maps);

  flushEffects();

  expect(infoWindow.open).toBeCalledTimes(1);

  rerender(
    <Mock position={{ lat: 0, lng: 1 }} maxWidth={200}>
      Content
    </Mock>,
  );

  flushEffects();

  expect(infoWindow.open).toBeCalledTimes(2);

  rerender(
    <Mock position={{ lat: 0, lng: 1 }} maxWidth={200}>
      Content
    </Mock>,
  );

  flushEffects();

  expect(infoWindow.open).toBeCalledTimes(2);

  rerender(
    <Mock position={{ lat: 0, lng: 1 }} maxWidth={300}>
      Content
    </Mock>,
  );

  flushEffects();

  expect(infoWindow.open).toBeCalledTimes(3);
  expect(infoWindow.close).toBeCalledTimes(0);
});

it("attaches handlers", () => {
  const { maps } = ctx;
  const { rerender, unmount } = render(
    <Mock position={{ lat: 0, lng: 1 }}>Content</Mock>,
  );

  const infoWindow = getMockInstance(ctx.maps);
  const addListenerMock = getFnMock(infoWindow.addListener);

  flushEffects();

  expect(addListenerMock).toBeCalledTimes(1);

  expect(() => {
    maps.event.trigger(infoWindow, InfoWindowEvent.onCloseClick);
  }).not.toThrow();

  const onCloseClick = jest.fn();

  rerender(
    <Mock position={{ lat: 0, lng: 1 }} onCloseClick={onCloseClick}>
      Content
    </Mock>,
  );

  maps.event.trigger(infoWindow, InfoWindowEvent.onCloseClick);

  expect(onCloseClick).toBeCalledTimes(1);
  expect(addListenerMock).toBeCalledTimes(1);

  unmount();

  expect(addListenerMock.mock.results[0].value.remove).toBeCalledTimes(1);
});

it("reopens on close click", () => {
  const { maps } = ctx;

  render(<Mock position={{ lat: 0, lng: 1 }}>Content</Mock>);

  const infoWindow = getMockInstance(ctx.maps);

  flushEffects();

  expect(infoWindow.open).toBeCalledTimes(1);

  maps.event.trigger(infoWindow, InfoWindowEvent.onCloseClick);

  expect(infoWindow.open).toBeCalledTimes(2);
});

it("renders portal when react element passed as children", () => {
  const { maps } = ctx;
  const ref = React.createRef<HTMLDivElement>();
  const { rerender } = render(
    <Mock position={{ lat: 0, lng: 1 }}>
      <div ref={ref}>HTML Content</div>
    </Mock>,
  );

  const infoWindow = getMockInstance(maps);

  expect(infoWindow.getContent()).toMatchInlineSnapshot(`
<div>
  <div>
    HTML Content
  </div>
</div>
`);

  rerender(
    <Mock position={{ lat: 0, lng: 1 }}>
      <div ref={ref}>Another HTML Content</div>
    </Mock>,
  );

  expect(infoWindow.getContent()).toMatchInlineSnapshot(`
<div>
  <div>
    Another HTML Content
  </div>
</div>
`);
});

it("cleans up on unmount", () => {
  const { maps } = ctx;
  const { unmount } = render(
    <Mock position={{ lat: 0, lng: 1 }}>Content</Mock>,
  );

  const infoWindow = getMockInstance(maps);

  flushEffects();

  expect(infoWindow.close).toBeCalledTimes(0);

  unmount();

  expect(infoWindow.close).toBeCalledTimes(1);
});

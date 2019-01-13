import React, { MutableRefObject, createRef } from "react";
import { cleanup, flushEffects, render } from "react-testing-library";

import { mockMaps } from "../../__testutils__/mockMaps";
import { getClassMockInstance, getFnMock } from "../../__testutils__/testUtils";
import {
  GoogleMapsAPIContext,
  useGoogleMap,
} from "../../context/GoogleMapsContext";
import { Omit } from "../../internal/DataUtils";
import { Map, MapProps } from "../Map";
import { MapEvent } from "../MapEvent";

let maps: typeof google.maps;

function getMockInstance(clazz: unknown): google.maps.Map {
  return getClassMockInstance(clazz);
}

interface MapWrapperProps extends Omit<MapProps, "zoom" | "center"> {
  readonly zoom?: MapProps["zoom"];
  readonly center?: MapProps["center"];
}

function MapWrapper({
  zoom = 0,
  center = { lat: 0, lng: 1 },
  ...props
}: MapWrapperProps) {
  return (
    <GoogleMapsAPIContext.Provider value={maps}>
      <Map zoom={zoom} center={center} {...props} />
    </GoogleMapsAPIContext.Provider>
  );
}

beforeEach(() => {
  maps = mockMaps();
});

afterEach(cleanup);

it("mounts and unmounts", () => {
  const { unmount, container } = render(<MapWrapper />);

  expect(maps.Map).toBeCalledTimes(0);

  flushEffects();

  const { firstChild } = container;
  const mapMock = getFnMock(maps.Map);

  expect(mapMock).toBeCalledTimes(1);
  expect(mapMock.mock.calls[0][0]).toBe(firstChild);
  expect(mapMock.mock.calls[0][1]).toMatchInlineSnapshot(`
Object {
  "backgroundColor": undefined,
  "center": LatLng {
    "latitude": 0,
    "longitude": 1,
  },
  "clickableIcons": true,
  "disableDefaultUI": true,
  "disableDoubleClickZoom": false,
  "mapTypeId": "ROADMAP",
  "zoom": 0,
}
`);
  expect(maps.event.clearInstanceListeners).toBeCalledTimes(0);

  unmount();

  expect(maps.event.clearInstanceListeners).toBeCalledTimes(1);
  expect(maps.event.clearInstanceListeners).lastCalledWith(firstChild);
});

it("renders div elements and passes classes or styles to it", () => {
  const { rerender, container } = render(<MapWrapper />);

  expect(container).toMatchInlineSnapshot(`
<div>
  <div />
</div>
`);

  rerender(<MapWrapper style={{ display: "none" }} />);

  expect(container).toMatchInlineSnapshot(`
<div>
  <div
    style="display: none;"
  />
</div>
`);

  rerender(<MapWrapper className="hide" />);

  expect(container).toMatchInlineSnapshot(`
<div>
  <div
    class="hide"
    style=""
  />
</div>
`);
});

it("initializes map with default options", () => {
  const mapMock = getFnMock(maps.Map);
  const { container } = render(<MapWrapper />);

  expect(mapMock).toBeCalledTimes(0);

  flushEffects();

  expect(mapMock).toBeCalledTimes(1);
  expect(mapMock.mock.calls[0][0]).toBe(container.firstChild);
  expect(mapMock.mock.calls[0][1]).toMatchInlineSnapshot(`
Object {
  "backgroundColor": undefined,
  "center": LatLng {
    "latitude": 0,
    "longitude": 1,
  },
  "clickableIcons": true,
  "disableDefaultUI": true,
  "disableDoubleClickZoom": false,
  "mapTypeId": "ROADMAP",
  "zoom": 0,
}
`);
});

it("passes custom options to map", () => {
  const mapMock = getFnMock(maps.Map);
  const { container } = render(
    <MapWrapper
      zoom={10}
      center={{ lat: 20, lng: 30 }}
      mapTypeId="HYBRID"
      clickableIcons={false}
      disableDoubleClickZoom={true}
    />,
  );

  expect(mapMock).toBeCalledTimes(0);

  flushEffects();

  expect(mapMock).toBeCalledTimes(1);
  expect(mapMock.mock.calls[0][0]).toBe(container.firstChild);
  expect(mapMock.mock.calls[0][1]).toMatchInlineSnapshot(`
Object {
  "backgroundColor": undefined,
  "center": LatLng {
    "latitude": 20,
    "longitude": 30,
  },
  "clickableIcons": false,
  "disableDefaultUI": true,
  "disableDoubleClickZoom": true,
  "mapTypeId": "HYBRID",
  "zoom": 10,
}
`);
});

it("updates options only with changed props", () => {
  const { rerender } = render(<MapWrapper zoom={10} />);

  flushEffects();

  const mapInstance = getMockInstance(maps.Map);
  const setOptionsMock = getFnMock(mapInstance.setOptions);

  maps.event.trigger(mapInstance, MapEvent.onBoundsChanged);

  flushEffects();

  rerender(<MapWrapper zoom={20} />);

  expect(setOptionsMock).toBeCalledTimes(0);

  flushEffects();

  expect(setOptionsMock).toBeCalledTimes(1);
  expect(setOptionsMock.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "zoom": 20,
}
`);

  rerender(<MapWrapper zoom={20} />);

  flushEffects();

  expect(setOptionsMock).toBeCalledTimes(1);

  rerender(<MapWrapper zoom={10} />);

  flushEffects();

  expect(setOptionsMock).toBeCalledTimes(2);
  expect(setOptionsMock.mock.calls[1][0]).toMatchInlineSnapshot(`
Object {
  "zoom": 10,
}
`);
});

it("waits for 'bounds_changed' to attach handlers", () => {
  const events = new global.Map(Object.entries(MapEvent));
  const handlerProps = {
    onClick: jest.fn(),
    onDoubleClick: jest.fn(),
    onRightClick: jest.fn(),
    onMouseOut: jest.fn(),
    onMouseOver: jest.fn(),
    onMouseMove: jest.fn(),
    onDrag: jest.fn(),
    onDragStart: jest.fn(),
    onDragEnd: jest.fn(),
    onIdle: jest.fn(),
    onTilesLoaded: jest.fn(),
    onTiltChanged: jest.fn(),
    onZoomChanged: jest.fn(),
    onBoundsChanged: jest.fn(),
    onCenterChanged: jest.fn(),
    onHeadingChanged: jest.fn(),
    onMapTypeIdChanged: jest.fn(),
    onProjectionChanged: jest.fn(),
  };
  const handlerMap = new global.Map(Object.entries(handlerProps));

  const { rerender, unmount } = render(<MapWrapper {...handlerProps} />);

  flushEffects();

  const mapInstance = getMockInstance(maps.Map);
  const addListenerMock = getFnMock(mapInstance.addListener);

  flushEffects();

  expect(() => {
    events.forEach(eventName => {
      if (eventName !== MapEvent.onBoundsChanged) {
        maps.event.trigger(mapInstance, eventName);
      }
    });
  }).not.toThrow();

  events.forEach((eventName, handlerProp) => {
    if (eventName === MapEvent.onBoundsChanged) {
      return;
    }

    const handler = handlerMap.get(handlerProp);

    expect(handler).toBeCalledTimes(0);

    maps.event.trigger(mapInstance, eventName);

    expect(handler).toBeCalledTimes(0);
  });

  expect(() => {
    maps.event.trigger(mapInstance, MapEvent.onBoundsChanged);
  }).not.toThrow();

  events.forEach((eventName, handlerProp) => {
    const handler = handlerMap.get(handlerProp);

    expect(handler).toBeCalledTimes(0);

    maps.event.trigger(mapInstance, eventName);

    expect(handler).toBeCalledTimes(1);
  });

  rerender(<MapWrapper />);

  events.forEach((eventName, handlerProp) => {
    const handler = handlerMap.get(handlerProp);

    maps.event.trigger(mapInstance, eventName);

    expect(handler).toBeCalledTimes(1);
  });

  expect(addListenerMock).toBeCalledTimes(events.size);

  unmount();

  addListenerMock.mock.results.forEach(x => {
    expect(x.value.remove).toBeCalledTimes(1);
  });
});

it("returns current zoom in 'onZoomChanged' handler", () => {
  const onZoomChanged = jest.fn();

  render(<MapWrapper zoom={300} onZoomChanged={onZoomChanged} />);

  flushEffects();

  const mapInstance = getMockInstance(maps.Map);

  maps.event.trigger(mapInstance, MapEvent.onBoundsChanged);

  flushEffects();

  expect(onZoomChanged).toBeCalledTimes(0);

  maps.event.trigger(mapInstance, MapEvent.onZoomChanged);

  expect(onZoomChanged).toBeCalledTimes(1);
  expect(onZoomChanged.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "zoom": 300,
}
`);
});

it("returns current bounds in 'onBoundsChanged' handler", () => {
  const onBoundsChanged = jest.fn();

  render(<MapWrapper onBoundsChanged={onBoundsChanged} />);

  flushEffects();

  const mapInstance = getMockInstance(maps.Map);

  maps.event.trigger(mapInstance, MapEvent.onBoundsChanged);

  flushEffects();

  expect(onBoundsChanged).toBeCalledTimes(0);

  maps.event.trigger(mapInstance, MapEvent.onBoundsChanged);

  expect(onBoundsChanged).toBeCalledTimes(1);
  expect(onBoundsChanged.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "bounds": Object {
    "east": 0,
    "north": 0,
    "south": 0,
    "west": 0,
  },
}
`);
});

it("passes map in context", () => {
  function MapChildren({
    mapRef,
  }: {
    mapRef: MutableRefObject<null | google.maps.Map>;
  }) {
    // eslint-disable-next-line no-param-reassign
    mapRef.current = useGoogleMap();

    return null;
  }

  const ref = createRef<null | google.maps.Map>();

  render(
    <MapWrapper>
      <MapChildren mapRef={ref} />
    </MapWrapper>,
  );

  flushEffects();

  const mapInstance = getMockInstance(maps.Map);

  expect(ref.current).toBe(mapInstance);
});

import React from "react";
import { flushEffects, render } from "react-testing-library";

import { initMapMockComponent } from "../../__testutils__/testContext";
import { getClassMockInstance, getFnMock } from "../../__testutils__/testUtils";
import { PlaceAutocomplete } from "../PlaceAutocomplete";
import { PlaceAutocompleteEvent } from "../PlaceAutocompleteEvent";

function getMockInstance(
  maps: typeof google.maps,
): google.maps.places.Autocomplete {
  return getClassMockInstance(maps.places.Autocomplete);
}

const [Mock, ctx] = initMapMockComponent(PlaceAutocomplete);

it("connects to rendered input", () => {
  const { maps } = ctx;
  const { getByTestId } = render(
    <Mock
      render={({ ref }) => <input ref={ref} type="text" data-testid="input" />}
    />,
  );

  flushEffects();

  const autocomplete = getMockInstance(maps);
  const input = getByTestId("input");

  expect(autocomplete.get("input")).toBe(input);
});

it("passes props", () => {
  const { maps } = ctx;
  const { rerender } = render(
    <Mock
      placeIdOnly={true}
      strictBounds={true}
      types={["geocode"]}
      componentRestrictions={{ country: "USA" }}
      bounds={{ east: -96, north: 37, south: 31, west: -112 }}
      render={({ ref }) => <input ref={ref} type="text" />}
    />,
  );

  flushEffects();

  const autocomplete = getMockInstance(maps);
  const setValuesMock = getFnMock(autocomplete.setValues);

  expect(setValuesMock).toBeCalledTimes(1);
  expect(setValuesMock.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "bounds": Object {
    "east": -96,
    "north": 37,
    "south": 31,
    "west": -112,
  },
  "componentRestrictions": Object {
    "country": "USA",
  },
  "placeIdOnly": true,
  "strictBounds": true,
  "types": Array [
    "geocode",
  ],
}
`);

  rerender(
    <Mock
      placeIdOnly={true}
      render={({ ref }) => <input ref={ref} type="text" />}
    />,
  );

  flushEffects();

  expect(setValuesMock).toBeCalledTimes(2);
  expect(setValuesMock.mock.calls[1][0]).toMatchInlineSnapshot(`
Object {
  "bounds": undefined,
  "componentRestrictions": undefined,
  "placeIdOnly": true,
  "strictBounds": false,
  "types": undefined,
}
`);

  rerender(
    <Mock
      placeIdOnly={true}
      render={({ ref }) => <input ref={ref} type="text" />}
    />,
  );

  flushEffects();

  expect(setValuesMock).toBeCalledTimes(2);

  rerender(<Mock render={({ ref }) => <input ref={ref} type="text" />} />);

  flushEffects();

  expect(setValuesMock).toBeCalledTimes(3);
  expect(setValuesMock.mock.calls[1][0]).toMatchInlineSnapshot(`
Object {
  "bounds": undefined,
  "componentRestrictions": undefined,
  "placeIdOnly": true,
  "strictBounds": false,
  "types": undefined,
}
`);
});

it("attaches handlers", () => {
  const { maps } = ctx;
  const onPlaceChanged = jest.fn();
  const { rerender, unmount } = render(
    <Mock render={({ ref }) => <input ref={ref} type="text" />} />,
  );

  flushEffects();

  const autocomplete = getMockInstance(maps);
  const addListenerMock = getFnMock(autocomplete.addListener);

  expect(addListenerMock).toBeCalledTimes(1);

  expect(() => {
    maps.event.trigger(autocomplete, PlaceAutocompleteEvent.onPlaceChanged);
  }).not.toThrow();

  rerender(
    <Mock
      onPlaceChanged={onPlaceChanged}
      render={({ ref }) => <input ref={ref} type="text" />}
    />,
  );

  flushEffects();

  expect(onPlaceChanged).toBeCalledTimes(0);

  maps.event.trigger(autocomplete, PlaceAutocompleteEvent.onPlaceChanged);

  expect(onPlaceChanged).toBeCalledTimes(1);

  rerender(<Mock render={({ ref }) => <input ref={ref} type="text" />} />);

  flushEffects();

  maps.event.trigger(autocomplete, PlaceAutocompleteEvent.onPlaceChanged);

  expect(onPlaceChanged).toBeCalledTimes(1);

  unmount();

  expect(addListenerMock.mock.results[0].value.remove).toBeCalledTimes(1);

  expect(addListenerMock).toBeCalledTimes(1);
});

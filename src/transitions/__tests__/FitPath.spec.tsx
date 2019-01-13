import React from "react";
import { cleanup, flushEffects, render } from "react-testing-library";

import { initMapMockComponent } from "../../__testutils__/testContext";
import { getFnMock } from "../../__testutils__/testUtils";
import { FitPath } from "../FitPath";

afterEach(cleanup);

const [Mock, ctx] = initMapMockComponent(FitPath);

it("runs animation", () => {
  const fitBoundsMock = getFnMock(ctx.map.fitBounds);

  const { rerender } = render(
    <Mock
      path={[
        { lat: -2, lng: -2 },
        { lat: -1, lng: -1 },
        { lat: 1, lng: 1 },
        { lat: 2, lng: 2 },
      ]}
    />,
  );

  flushEffects();

  expect(fitBoundsMock).toBeCalledTimes(1);
  expect(fitBoundsMock).toMatchInlineSnapshot(`
[MockFunction] {
  "calls": Array [
    Array [
      LatLngBounds {
        "east": 2,
        "north": 2,
        "south": -2,
        "west": -2,
      },
    ],
  ],
  "results": Array [
    Object {
      "isThrow": false,
      "value": undefined,
    },
  ],
}
`);

  rerender(
    <Mock
      path={[
        { lat: -2, lng: -2 },
        { lat: -1, lng: -1 },
        { lat: 1, lng: 1 },
        { lat: 2, lng: 2 },
      ]}
    />,
  );

  flushEffects();

  expect(fitBoundsMock).toBeCalledTimes(1);

  rerender(
    <Mock
      path={[
        { lat: -3, lng: -3 },
        { lat: -2, lng: -2 },
        { lat: 2, lng: 2 },
        { lat: 3, lng: 3 },
      ]}
    />,
  );

  flushEffects();

  expect(fitBoundsMock).toBeCalledTimes(2);
  expect(fitBoundsMock).toMatchInlineSnapshot(`
[MockFunction] {
  "calls": Array [
    Array [
      LatLngBounds {
        "east": 2,
        "north": 2,
        "south": -2,
        "west": -2,
      },
    ],
    Array [
      LatLngBounds {
        "east": 3,
        "north": 3,
        "south": -3,
        "west": -3,
      },
    ],
  ],
  "results": Array [
    Object {
      "isThrow": false,
      "value": undefined,
    },
    Object {
      "isThrow": false,
      "value": undefined,
    },
  ],
}
`);
});

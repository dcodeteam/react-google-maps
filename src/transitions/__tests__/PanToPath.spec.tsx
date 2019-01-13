import React from "react";
import { cleanup, flushEffects, render } from "react-testing-library";

import { initMapMockComponent } from "../../__testutils__/testContext";
import { getFnMock } from "../../__testutils__/testUtils";
import { PanToPath } from "../PanToPath";

afterEach(cleanup);

const [Mock, ctx] = initMapMockComponent(PanToPath);

it("runs animation", () => {
  const panToBoundsMock = getFnMock(ctx.map.panToBounds);
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

  expect(panToBoundsMock).toBeCalledTimes(1);
  expect(panToBoundsMock.mock.calls[0][0]).toMatchInlineSnapshot(`
LatLngBounds {
  "east": 2,
  "north": 2,
  "south": -2,
  "west": -2,
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

  expect(panToBoundsMock).toBeCalledTimes(1);

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

  expect(panToBoundsMock).toBeCalledTimes(2);
  expect(panToBoundsMock.mock.calls[1][0]).toMatchInlineSnapshot(`
LatLngBounds {
  "east": 3,
  "north": 3,
  "south": -3,
  "west": -3,
}
`);
});

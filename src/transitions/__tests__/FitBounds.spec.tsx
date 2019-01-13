import React from "react";
import { cleanup, flushEffects, render } from "react-testing-library";

import { initMapMockComponent } from "../../__testutils__/testContext";
import { getFnMock } from "../../__testutils__/testUtils";
import { FitBounds } from "../FitBounds";

afterEach(cleanup);

const [Mock, ctx] = initMapMockComponent(FitBounds);

it("runs animation", () => {
  const fitBoundsMock = getFnMock(ctx.map.fitBounds);
  const { rerender } = render(
    <Mock bounds={{ east: 1, north: 2, south: 3, west: 4 }} />,
  );

  flushEffects();

  expect(fitBoundsMock).toBeCalledTimes(1);
  expect(fitBoundsMock.mock.calls[0][0]).toMatchInlineSnapshot(`
LatLngBounds {
  "east": 1,
  "north": 2,
  "south": 3,
  "west": 4,
}
`);

  rerender(<Mock bounds={{ east: 1, north: 2, south: 3, west: 4 }} />);

  flushEffects();

  expect(fitBoundsMock).toBeCalledTimes(1);

  rerender(<Mock bounds={{ east: 5, north: 6, south: 7, west: 8 }} />);

  flushEffects();

  expect(fitBoundsMock).toBeCalledTimes(2);
  expect(fitBoundsMock.mock.calls[1][0]).toMatchInlineSnapshot(`
LatLngBounds {
  "east": 5,
  "north": 6,
  "south": 7,
  "west": 8,
}
`);
});

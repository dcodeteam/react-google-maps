import React from "react";
import { cleanup, flushEffects, render } from "react-testing-library";

import { initMapMockComponent } from "../../__testutils__/testContext";
import { getFnMock } from "../../__testutils__/testUtils";
import { PanToBounds } from "../PanToBounds";

afterEach(cleanup);

const [Mock, ctx] = initMapMockComponent(PanToBounds);

it("runs animation", () => {
  const panToBoundsMock = getFnMock(ctx.map.panToBounds);
  const { rerender } = render(
    <Mock
      bounds={{
        north: 1,
        east: 1,
        south: 2,
        west: 2,
      }}
    />,
  );

  flushEffects();

  expect(panToBoundsMock).toBeCalledTimes(1);
  expect(panToBoundsMock.mock.calls[0][0]).toMatchInlineSnapshot(`
LatLngBounds {
  "east": 1,
  "north": 1,
  "south": 2,
  "west": 2,
}
`);

  rerender(
    <Mock
      bounds={{
        north: 1,
        east: 1,
        south: 2,
        west: 2,
      }}
    />,
  );

  flushEffects();

  expect(panToBoundsMock).toBeCalledTimes(1);

  rerender(
    <Mock
      bounds={{
        north: 3,
        east: 3,
        south: 4,
        west: 4,
      }}
    />,
  );

  flushEffects();

  expect(panToBoundsMock).toBeCalledTimes(2);
  expect(panToBoundsMock.mock.calls[1][0]).toMatchInlineSnapshot(`
LatLngBounds {
  "east": 3,
  "north": 3,
  "south": 4,
  "west": 4,
}
`);
});

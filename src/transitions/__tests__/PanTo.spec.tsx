import React from "react";
import { cleanup, flushEffects, render } from "react-testing-library";

import { initMapMockComponent } from "../../__testutils__/testContext";
import { getFnMock } from "../../__testutils__/testUtils";
import { PanTo } from "../PanTo";

afterEach(cleanup);

const [Mock, ctx] = initMapMockComponent(PanTo);

it("runs animation", () => {
  const panToMock = getFnMock(ctx.map.panTo);
  const { rerender } = render(<Mock position={{ lat: 1, lng: 2 }} />);

  flushEffects();

  expect(panToMock).toBeCalledTimes(1);
  expect(panToMock.mock.calls[0][0]).toMatchInlineSnapshot(`
LatLng {
  "latitude": 1,
  "longitude": 2,
}
`);

  rerender(<Mock position={{ lat: 1, lng: 2 }} />);

  flushEffects();

  expect(panToMock).toBeCalledTimes(1);

  rerender(<Mock position={{ lat: 3, lng: 4 }} />);

  flushEffects();

  expect(panToMock).toBeCalledTimes(2);
  expect(panToMock.mock.calls[1][0]).toMatchInlineSnapshot(`
LatLng {
  "latitude": 3,
  "longitude": 4,
}
`);
});

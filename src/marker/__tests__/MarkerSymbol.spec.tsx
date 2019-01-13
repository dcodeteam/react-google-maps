import React from "react";
import { cleanup, flushEffects, render } from "react-testing-library";

import { initMapMarkerMockComponent } from "../../__testutils__/testContext";
import { getFnMock } from "../../__testutils__/testUtils";
import { MarkerSymbol } from "../MarkerSymbol";

const [Mock, ctx] = initMapMarkerMockComponent(MarkerSymbol);

afterEach(cleanup);

it("converts props to icon", () => {
  const { marker } = ctx;
  const setIconMock = getFnMock(marker.setIcon);
  const { rerender } = render(
    <Mock
      path="svg-path"
      scale={0.7}
      rotation={1}
      fillColor="black"
      fillOpacity={0.5}
      strokeColor="white"
      strokeWeight={2}
      strokeOpacity={3}
      anchor={{ x: 10, y: 15 }}
    />,
  );

  expect(setIconMock).toBeCalledTimes(0);

  flushEffects();

  expect(setIconMock).toBeCalledTimes(1);
  expect(setIconMock.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "anchor": Point {
    "x": 10,
    "y": 15,
  },
  "fillColor": "black",
  "fillOpacity": 0.5,
  "path": "svg-path",
  "rotation": 1,
  "scale": 0.7,
  "strokeColor": "white",
  "strokeOpacity": 3,
  "strokeWeight": 2,
}
`);

  rerender(<Mock path="svg-path" />);

  flushEffects();

  expect(setIconMock).toBeCalledTimes(2);
  expect(setIconMock.mock.calls[1][0]).toMatchInlineSnapshot(`
Object {
  "anchor": Point {
    "x": 0,
    "y": 0,
  },
  "fillColor": "black",
  "fillOpacity": 0,
  "path": "svg-path",
  "rotation": 0,
  "scale": 1,
  "strokeColor": "black",
  "strokeOpacity": 1,
  "strokeWeight": 1,
}
`);

  rerender(<Mock path="svg-path" />);

  flushEffects();

  expect(setIconMock).toBeCalledTimes(2);
});

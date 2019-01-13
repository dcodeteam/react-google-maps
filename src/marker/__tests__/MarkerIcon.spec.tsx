import React from "react";
import { cleanup, flushEffects, render } from "react-testing-library";

import { initMapMarkerMockComponent } from "../../__testutils__/testContext";
import { getFnMock } from "../../__testutils__/testUtils";
import { MarkerIcon } from "../MarkerIcon";

const [Mock, ctx] = initMapMarkerMockComponent(MarkerIcon);

afterEach(cleanup);

it("converts props to icon", () => {
  const { marker } = ctx;
  const setIconMock = getFnMock(marker.setIcon);
  const { rerender } = render(
    <Mock
      url="https://url.to/icon.png"
      anchor={{ x: 1, y: 2 }}
      origin={{ x: 3, y: 4 }}
      labelOrigin={{ x: 5, y: 6 }}
      size={{ width: 7, height: 8 }}
      scaledSize={{ width: 9, height: 10 }}
    />,
  );

  expect(setIconMock).toBeCalledTimes(0);

  flushEffects();

  expect(setIconMock).toBeCalledTimes(1);
  expect(setIconMock.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "anchor": Point {
    "x": 1,
    "y": 2,
  },
  "labelOrigin": Point {
    "x": 5,
    "y": 6,
  },
  "origin": Point {
    "x": 3,
    "y": 4,
  },
  "scaledSize": Size {
    "height": 10,
    "width": 9,
  },
  "size": Size {
    "height": 8,
    "width": 7,
  },
  "url": "https://url.to/icon.png",
}
`);

  rerender(<Mock url="https://url.to/icon.png" />);

  flushEffects();

  expect(setIconMock).toBeCalledTimes(2);
  expect(setIconMock.mock.calls[1][0]).toMatchInlineSnapshot(`
Object {
  "anchor": undefined,
  "labelOrigin": undefined,
  "origin": Point {
    "x": 0,
    "y": 0,
  },
  "scaledSize": undefined,
  "size": undefined,
  "url": "https://url.to/icon.png",
}
`);

  rerender(<Mock url="https://url.to/icon.png" />);

  flushEffects();

  expect(setIconMock).toBeCalledTimes(2);
});

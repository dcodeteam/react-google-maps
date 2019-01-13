import React from "react";
import { cleanup, flushEffects, render } from "react-testing-library";

import { initMapMockComponent } from "../../__testutils__/testContext";
import { getFnMock } from "../../__testutils__/testUtils";
import { MapTypeControl } from "../MapTypeControl";

const [Mock, ctx] = initMapMockComponent(MapTypeControl);

afterEach(cleanup);

it("sets default values on mount", () => {
  const setValuesMock = getFnMock(ctx.map.setValues);

  render(<Mock />);

  flushEffects();

  expect(setValuesMock).toBeCalledTimes(1);
  expect(setValuesMock.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "mapTypeControl": true,
  "mapTypeControlOptions": Object {
    "mapTypeIds": Array [
      "HYBRID",
      "ROADMAP",
      "SATELLITE",
      "TERRAIN",
    ],
    "position": "TOP_RIGHT",
    "style": "DEFAULT",
  },
}
`);
});

it("sets custom values on mount", () => {
  const setValuesMock = getFnMock(ctx.map.setValues);

  render(
    <Mock
      style="DROPDOWN_MENU"
      position="RIGHT_BOTTOM"
      mapTypeIds={["HYBRID", "ROADMAP"]}
    />,
  );

  flushEffects();

  expect(setValuesMock).toBeCalledTimes(1);
  expect(setValuesMock.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "mapTypeControl": true,
  "mapTypeControlOptions": Object {
    "mapTypeIds": Array [
      "HYBRID",
      "ROADMAP",
    ],
    "position": "RIGHT_BOTTOM",
    "style": "DROPDOWN_MENU",
  },
}
`);
});

it("updates values", () => {
  const setValuesMock = getFnMock(ctx.map.setValues);
  const { rerender } = render(<Mock />);

  flushEffects();

  expect(setValuesMock).toBeCalledTimes(1);
  expect(setValuesMock.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "mapTypeControl": true,
  "mapTypeControlOptions": Object {
    "mapTypeIds": Array [
      "HYBRID",
      "ROADMAP",
      "SATELLITE",
      "TERRAIN",
    ],
    "position": "TOP_RIGHT",
    "style": "DEFAULT",
  },
}
`);

  rerender(<Mock position="BOTTOM_CENTER" />);

  flushEffects();

  expect(setValuesMock).toBeCalledTimes(3);
  expect(setValuesMock.mock.calls[1][0]).toMatchInlineSnapshot(`
Object {
  "mapTypeControl": false,
  "mapTypeControlOptions": undefined,
}
`);
  expect(setValuesMock.mock.calls[2][0]).toMatchInlineSnapshot(`
Object {
  "mapTypeControl": true,
  "mapTypeControlOptions": Object {
    "mapTypeIds": Array [
      "HYBRID",
      "ROADMAP",
      "SATELLITE",
      "TERRAIN",
    ],
    "position": "BOTTOM_CENTER",
    "style": "DEFAULT",
  },
}
`);

  rerender(<Mock position="BOTTOM_CENTER" />);

  flushEffects();

  expect(setValuesMock).toBeCalledTimes(3);

  rerender(<Mock position="RIGHT_TOP" />);

  flushEffects();

  expect(setValuesMock).toBeCalledTimes(5);
  expect(setValuesMock.mock.calls[3][0]).toMatchInlineSnapshot(`
Object {
  "mapTypeControl": false,
  "mapTypeControlOptions": undefined,
}
`);
  expect(setValuesMock.mock.calls[4][0]).toMatchInlineSnapshot(`
Object {
  "mapTypeControl": true,
  "mapTypeControlOptions": Object {
    "mapTypeIds": Array [
      "HYBRID",
      "ROADMAP",
      "SATELLITE",
      "TERRAIN",
    ],
    "position": "RIGHT_TOP",
    "style": "DEFAULT",
  },
}
`);
});

it("unsets values on unmount", () => {
  const setValuesMock = getFnMock(ctx.map.setValues);
  const { unmount } = render(<Mock />);

  flushEffects();

  expect(setValuesMock).toBeCalledTimes(1);

  unmount();

  expect(setValuesMock).toBeCalledTimes(2);
  expect(setValuesMock.mock.calls[1]).toMatchInlineSnapshot(`
Array [
  Object {
    "mapTypeControl": false,
    "mapTypeControlOptions": undefined,
  },
]
`);
});

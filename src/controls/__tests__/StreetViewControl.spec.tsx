import React from "react";
import { cleanup, flushEffects, render } from "react-testing-library";

import { initMapMockComponent } from "../../__testutils__/testContext";
import { getFnMock } from "../../__testutils__/testUtils";
import { StreetViewControl } from "../StreetViewControl";

const [Mock, ctx] = initMapMockComponent(StreetViewControl);

afterEach(cleanup);

it("sets default values on mount", () => {
  const setValuesMock = getFnMock(ctx.map.setValues);

  render(<Mock />);

  flushEffects();

  expect(setValuesMock).toBeCalledTimes(1);
  expect(setValuesMock.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "streetViewControl": true,
  "streetViewControlOptions": Object {
    "position": "TOP_LEFT",
  },
}
`);
});

it("sets custom values on mount", () => {
  const setValuesMock = getFnMock(ctx.map.setValues);

  render(<Mock position="RIGHT_BOTTOM" />);

  flushEffects();

  expect(setValuesMock).toBeCalledTimes(1);
  expect(setValuesMock.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "streetViewControl": true,
  "streetViewControlOptions": Object {
    "position": "RIGHT_BOTTOM",
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
  "streetViewControl": true,
  "streetViewControlOptions": Object {
    "position": "TOP_LEFT",
  },
}
`);

  rerender(<Mock position="BOTTOM_CENTER" />);

  flushEffects();

  expect(setValuesMock).toBeCalledTimes(3);
  expect(setValuesMock.mock.calls[1][0]).toMatchInlineSnapshot(`
Object {
  "streetViewControl": false,
  "streetViewControlOptions": undefined,
}
`);
  expect(setValuesMock.mock.calls[2][0]).toMatchInlineSnapshot(`
Object {
  "streetViewControl": true,
  "streetViewControlOptions": Object {
    "position": "BOTTOM_CENTER",
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
  "streetViewControl": false,
  "streetViewControlOptions": undefined,
}
`);
  expect(setValuesMock.mock.calls[4][0]).toMatchInlineSnapshot(`
Object {
  "streetViewControl": true,
  "streetViewControlOptions": Object {
    "position": "RIGHT_TOP",
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
    "streetViewControl": false,
    "streetViewControlOptions": undefined,
  },
]
`);
});

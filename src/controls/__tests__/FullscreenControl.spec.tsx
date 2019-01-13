import React from "react";
import { cleanup, flushEffects, render } from "react-testing-library";

import { initMapMockComponent } from "../../__testutils__/testContext";
import { getFnMock } from "../../__testutils__/testUtils";
import { FullscreenControl } from "../FullscreenControl";

const [Mock, ctx] = initMapMockComponent(FullscreenControl);

beforeEach(cleanup);

it("sets default values on mount", () => {
  const setValuesMock = getFnMock(ctx.map.setValues);

  render(<Mock />);

  expect(setValuesMock).toBeCalledTimes(0);

  flushEffects();

  expect(setValuesMock).toBeCalledTimes(1);
  expect(setValuesMock.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "fullscreenControl": true,
  "fullscreenControlOptions": Object {
    "position": "RIGHT_TOP",
  },
}
`);
});

it("sets custom values on mount", () => {
  const setValuesMock = getFnMock(ctx.map.setValues);

  render(<Mock position="BOTTOM_CENTER" />);

  expect(setValuesMock).toBeCalledTimes(0);

  flushEffects();

  expect(setValuesMock).toBeCalledTimes(1);
  expect(setValuesMock.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "fullscreenControl": true,
  "fullscreenControlOptions": Object {
    "position": "BOTTOM_CENTER",
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
  "fullscreenControl": true,
  "fullscreenControlOptions": Object {
    "position": "RIGHT_TOP",
  },
}
`);

  rerender(<Mock position="BOTTOM_CENTER" />);

  flushEffects();

  expect(setValuesMock).toBeCalledTimes(3);
  expect(setValuesMock.mock.calls[1][0]).toMatchInlineSnapshot(`
Object {
  "fullscreenControl": false,
  "fullscreenControlOptions": undefined,
}
`);
  expect(setValuesMock.mock.calls[2][0]).toMatchInlineSnapshot(`
Object {
  "fullscreenControl": true,
  "fullscreenControlOptions": Object {
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
  "fullscreenControl": false,
  "fullscreenControlOptions": undefined,
}
`);
  expect(setValuesMock.mock.calls[4][0]).toMatchInlineSnapshot(`
Object {
  "fullscreenControl": true,
  "fullscreenControlOptions": Object {
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
  expect(setValuesMock.mock.calls[1][0]).toMatchInlineSnapshot(`
Object {
  "fullscreenControl": false,
  "fullscreenControlOptions": undefined,
}
`);
});

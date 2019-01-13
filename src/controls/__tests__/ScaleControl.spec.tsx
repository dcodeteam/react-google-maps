import React from "react";
import { cleanup, flushEffects, render } from "react-testing-library";

import { initMapMockComponent } from "../../__testutils__/testContext";
import { getFnMock } from "../../__testutils__/testUtils";
import { ScaleControl } from "../ScaleControl";

const [Mock, ctx] = initMapMockComponent(ScaleControl);

afterEach(cleanup);

it("sets values on mount", () => {
  const setValuesMock = getFnMock(ctx.map.setValues);

  render(<Mock />);

  flushEffects();

  expect(setValuesMock).toBeCalledTimes(1);
  expect(setValuesMock.mock.calls[0][0]).toMatchInlineSnapshot(`
Object {
  "scaleControl": true,
  "scaleControlOptions": Object {},
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
    "scaleControl": false,
    "scaleControlOptions": undefined,
  },
]
`);
});

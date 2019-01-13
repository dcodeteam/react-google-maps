import React from "react";
import { cleanup, flushEffects, render } from "react-testing-library";

import { initMapMockComponent } from "../../__testutils__/testContext";
import { getFnMock } from "../../__testutils__/testUtils";
import { PanBy } from "../PanBy";

afterEach(cleanup);

const [Mock, ctx] = initMapMockComponent(PanBy);

it("runs animation", () => {
  const panByMock = getFnMock(ctx.map.panBy);
  const { rerender } = render(<Mock offset={{ x: 1, y: 2 }} />);

  flushEffects();

  expect(panByMock).toBeCalledTimes(1);
  expect(panByMock.mock.calls[0][0]).toMatchInlineSnapshot(`1`);

  rerender(<Mock offset={{ x: 1, y: 2 }} />);

  flushEffects();

  expect(panByMock).toBeCalledTimes(1);

  rerender(<Mock offset={{ x: 3, y: 4 }} />);

  flushEffects();

  expect(panByMock).toBeCalledTimes(2);
  expect(panByMock.mock.calls[1][0]).toMatchInlineSnapshot(`3`);
});

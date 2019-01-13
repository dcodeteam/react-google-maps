import React from "react";
import { cleanup, flushEffects, render } from "react-testing-library";

import { initMapMockComponent } from "../../__testutils__/testContext";
import { CustomControl } from "../CustomControl";

const [Mock, ctx] = initMapMockComponent(CustomControl);

afterEach(cleanup);

it("adds control", () => {
  const { map, maps } = ctx;
  const ref = React.createRef<HTMLDivElement>();
  const controls = map.controls[maps.ControlPosition.TOP_LEFT];

  render(
    <Mock position="TOP_LEFT">
      <div ref={ref}>Content</div>
    </Mock>,
  );

  expect(ref.current).toMatchInlineSnapshot(`
<div>
  Content
</div>
`);

  flushEffects();

  expect(controls.getArray()).toMatchInlineSnapshot(`
Array [
  <div>
    <div>
      Content
    </div>
  </div>,
]
`);
});

it("updates control position", () => {
  const { map, maps } = ctx;
  const ref = React.createRef<HTMLDivElement>();

  const topLeftControls = map.controls[maps.ControlPosition.TOP_LEFT];
  const topRightControls = map.controls[maps.ControlPosition.TOP_RIGHT];

  const { rerender } = render(
    <Mock position="TOP_LEFT">
      <div ref={ref}>Content</div>
    </Mock>,
  );

  expect(ref.current).toMatchInlineSnapshot(`
<div>
  Content
</div>
`);

  flushEffects();

  expect(topLeftControls.getArray()).toMatchInlineSnapshot(`
Array [
  <div>
    <div>
      Content
    </div>
  </div>,
]
`);
  expect(topRightControls.getArray()).toMatchInlineSnapshot(`Array []`);

  rerender(
    <Mock position="TOP_LEFT">
      <div ref={ref}>Content</div>
    </Mock>,
  );

  flushEffects();

  expect(topLeftControls.getArray()).toMatchInlineSnapshot(`
Array [
  <div>
    <div>
      Content
    </div>
  </div>,
]
`);
  expect(topRightControls.getArray()).toMatchInlineSnapshot(`Array []`);

  rerender(
    <Mock position="TOP_RIGHT">
      <div ref={ref}>Content</div>
    </Mock>,
  );

  flushEffects();

  expect(topLeftControls.getArray()).toMatchInlineSnapshot(`Array []`);
  expect(topRightControls.getArray()).toMatchInlineSnapshot(`
Array [
  <div>
    <div>
      Content
    </div>
  </div>,
]
`);
});

it("updates children", () => {
  const ref = React.createRef<HTMLDivElement>();

  const { rerender } = render(
    <Mock position="TOP_LEFT">
      <div ref={ref}>Content</div>
    </Mock>,
  );

  expect(ref.current).not.toBeNull();

  const root = ref.current!.parentNode;

  expect(root).toMatchInlineSnapshot(`
<div>
  <div>
    Content
  </div>
</div>
`);

  rerender(<Mock position="TOP_LEFT">Plain Text</Mock>);

  expect(root).toMatchInlineSnapshot(`
<div>
  Plain Text
</div>
`);
});

it("removes node on unmount", () => {
  const { map, maps } = ctx;
  const topLeftControls = map.controls[maps.ControlPosition.TOP_LEFT];

  const { unmount } = render(
    <Mock position="TOP_LEFT">
      <div>Content</div>
    </Mock>,
  );

  flushEffects();

  expect(topLeftControls.getArray()).toMatchInlineSnapshot(`
Array [
  <div>
    <div>
      Content
    </div>
  </div>,
]
`);

  unmount();

  expect(topLeftControls.getArray()).toMatchInlineSnapshot(`Array []`);
});

it("should remove control only if it attached", () => {
  const { map, maps } = ctx;
  const topLeftControls = map.controls[maps.ControlPosition.TOP_LEFT];

  const { unmount } = render(
    <Mock position="TOP_LEFT">
      <div>Content</div>
    </Mock>,
  );

  flushEffects();

  expect(topLeftControls.push).toBeCalledTimes(1);
  expect(topLeftControls.removeAt).toBeCalledTimes(0);

  topLeftControls.removeAt(0);

  unmount();

  expect(topLeftControls.push).toBeCalledTimes(1);
  expect(topLeftControls.removeAt).toBeCalledTimes(1);
});

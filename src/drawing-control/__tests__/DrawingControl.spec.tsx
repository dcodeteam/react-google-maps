import { mount } from "enzyme";
import * as React from "react";

import {
  createMockHandlers,
  createMockMapComponent,
  emitEvent,
  forEachEvent,
  getClassMockInstance,
} from "../../__tests__/testUtils";
import { DrawingControl, DrawingControlProps } from "../DrawingControl";
import { DrawingControlEvent } from "../DrawingControlEvent";

function getMockInstance(): google.maps.drawing.DrawingManager {
  return getClassMockInstance(google.maps.drawing.DrawingManager);
}

describe("DrawingControl", () => {
  const { map, Mock } = createMockMapComponent(DrawingControl);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create drawing manager add attach to map", () => {
    mount(<Mock />);

    const manager = getMockInstance();

    expect(manager.setMap).toBeCalledTimes(1);
    expect(manager.setMap).lastCalledWith(map);
  });

  it("should set default options on mount", () => {
    mount(<Mock />);

    const manager = getMockInstance();

    expect(manager.setOptions).toBeCalledTimes(1);
    expect(manager.setOptions).lastCalledWith({
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: ["CIRCLE", "MARKER", "POLYGON", "POLYLINE", "RECTANGLE"],
        position: "TOP_LEFT",
      },
    });
  });

  it("should set custom options on mount", () => {
    mount(
      <Mock position="TOP_RIGHT" drawingModes={["POLYGON", "RECTANGLE"]} />,
    );

    const manager = getMockInstance();

    expect(manager.setOptions).toBeCalledTimes(1);
    expect(manager.setOptions).lastCalledWith({
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: ["POLYGON", "RECTANGLE"],
        position: "TOP_RIGHT",
      },
    });
  });

  it("should add listeners without handlers on mount", () => {
    mount(<Mock />);

    const manager = getMockInstance();

    const customEvents = 1;
    const instanceEvents = Object.keys(DrawingControlEvent).length;

    expect(manager.addListener).toBeCalledTimes(customEvents + instanceEvents);
  });

  it("should add listeners with handlers on mount", () => {
    const handlers = createMockHandlers(DrawingControlEvent);

    mount(<Mock {...handlers} />);

    const manager = getMockInstance();

    forEachEvent(DrawingControlEvent, (key, event) => {
      const handler = handlers[key];
      const payload = { key, event, overlay: { setMap: jest.fn() } };

      expect(handler).toBeCalledTimes(0);

      emitEvent(manager, event, payload);

      expect(handler).toBeCalledTimes(1);
      expect(handler).lastCalledWith(payload);
    });
  });

  it("should remove overlay from map on complete", () => {
    const onOverlayComplete = jest.fn();

    mount(<Mock onOverlayComplete={onOverlayComplete} />);

    const manager = getMockInstance();
    const overlay = { setMap: jest.fn() };

    emitEvent(manager, DrawingControlEvent.onOverlayComplete, { overlay });

    expect(overlay.setMap).toBeCalledTimes(1);
    expect(overlay.setMap).lastCalledWith(null);
  });

  it("should change options on update", () => {
    const initialProps: DrawingControlProps = {
      position: "BOTTOM_CENTER",
      drawingModes: ["CIRCLE"],
    };
    const updatedProps: DrawingControlProps = {
      position: "TOP_CENTER",
      drawingModes: ["MARKER", "POLYGON"],
    };

    const wrapper = mount(<Mock {...initialProps} />);
    const manager = getMockInstance();

    expect(manager.setOptions).toBeCalledTimes(1);

    wrapper.setProps({
      position: initialProps.position,
      drawingModes: initialProps.drawingModes,
    });

    expect(manager.setOptions).toBeCalledTimes(1);

    wrapper.setProps({
      position: updatedProps.position,
      drawingModes: updatedProps.drawingModes,
    });

    expect(manager.setOptions).toBeCalledTimes(2);
    expect(manager.setOptions).lastCalledWith({
      drawingControl: true,
      drawingControlOptions: updatedProps,
    });
  });

  it("should remove drawing manager from map on unmount", () => {
    const wrapper = mount(<Mock />);
    const manager = getMockInstance();

    expect(manager.setMap).toHaveBeenCalledTimes(1);
    expect(manager.setMap).toHaveBeenLastCalledWith(map);

    wrapper.unmount();

    expect(manager.setMap).toHaveBeenCalledTimes(2);
    expect(manager.setMap).toHaveBeenLastCalledWith(null);
  });
});

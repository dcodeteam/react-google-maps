import { mount } from "enzyme";
import * as React from "react";

import {
  createMockHandlers,
  createMockMapComponent,
  emitEvent,
  forEachEvent,
  getClassMockInstance,
} from "../../__tests__/testUtils";
import { DataLayerEvent } from "../DataLayerEvent";
import { DataPolygon } from "../DataPolygon";

function getMockFeatureInstance(): google.maps.Data.Feature {
  return getClassMockInstance(google.maps.Data.Feature);
}

function getMockPolygonInstance(): google.maps.Data.Polygon {
  return getClassMockInstance(google.maps.Data.Polygon);
}

describe("DataPolygon", () => {
  const { map, Mock } = createMockMapComponent(DataPolygon);
  const instanceEvents = Object.keys(DataLayerEvent).length;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create feature on mount", () => {
    mount(<Mock geometry={[]} />);

    const feature = getMockFeatureInstance();

    expect(map.data.add).toBeCalledTimes(1);
    expect(map.data.add).lastCalledWith(feature);
  });

  it("should set polygon to feature on mount", () => {
    mount(<Mock geometry={[[{ lat: 1, lng: 2 }]]} />);

    const feature = getMockFeatureInstance();
    const polygon = getMockPolygonInstance();

    expect(polygon.getArray()).toEqual([[{ lat: 1, lng: 2 }]]);

    expect(feature.setGeometry).toBeCalledTimes(1);
    expect(feature.setGeometry).lastCalledWith(polygon);
  });

  it("should set default style on mount", () => {
    mount(<Mock geometry={[]} />);

    const feature = getMockFeatureInstance();

    expect(map.data.overrideStyle).toBeCalledTimes(1);
    expect(map.data.overrideStyle).lastCalledWith(feature, {
      clickable: true,
    });
  });

  it("should set custom style on mount", () => {
    mount(
      <Mock
        geometry={[]}
        clickable={false}
        fillColor="#000000"
        fillOpacity={0.4}
        strokeColor="#000000"
        strokeOpacity={1}
        strokeWeight={3}
      />,
    );

    const feature = getMockFeatureInstance();

    expect(map.data.overrideStyle).toBeCalledTimes(1);
    expect(map.data.overrideStyle).lastCalledWith(feature, {
      clickable: false,
      fillColor: "#000000",
      fillOpacity: 0.4,
      strokeColor: "#000000",
      strokeOpacity: 1,
      strokeWeight: 3,
      zIndex: undefined,
    });
  });

  it("should change feature style on update", () => {
    const wrapper = mount(<Mock geometry={[]} />);

    const feature = getMockFeatureInstance();

    expect(map.data.overrideStyle).toBeCalledTimes(1);

    wrapper.setProps({ clickable: true });

    expect(map.data.overrideStyle).toBeCalledTimes(1);

    wrapper.setProps({
      clickable: false,
      fillColor: "#000000",
      fillOpacity: 0.4,
      strokeColor: "#000000",
      strokeOpacity: 1,
      strokeWeight: 3,
    });

    expect(map.data.overrideStyle).toBeCalledTimes(2);
    expect(map.data.overrideStyle).lastCalledWith(feature, {
      clickable: false,
      fillColor: "#000000",
      fillOpacity: 0.4,
      strokeColor: "#000000",
      strokeOpacity: 1,
      strokeWeight: 3,
    });
  });

  it("should add listeners without handlers on mount", () => {
    mount(<Mock geometry={[]} />);

    expect(map.data.addListener).toBeCalledTimes(instanceEvents);
  });

  it("should add listeners with handlers on mount", () => {
    const handlers = createMockHandlers(DataLayerEvent);

    mount(<Mock {...handlers} geometry={[]} />);

    const feature = getMockFeatureInstance();

    forEachEvent(DataLayerEvent, (key, event) => {
      const handler = handlers[key];

      expect(handler).toBeCalledTimes(0);

      emitEvent(map.data, event, { feature: {} });

      expect(handler).toBeCalledTimes(0);

      emitEvent(map.data, event, { feature });

      expect(handler).toBeCalledTimes(1);
      expect(handler).lastCalledWith({ feature });
    });
  });

  it("should remove feature on unmount", () => {
    const wrapper = mount(<Mock geometry={[]} />);

    const feature = getMockFeatureInstance();

    expect(map.data.add).toBeCalledTimes(1);
    expect(map.data.remove).toBeCalledTimes(0);

    wrapper.unmount();

    expect(map.data.add).toBeCalledTimes(1);
    expect(map.data.remove).toBeCalledTimes(1);
    expect(map.data.remove).lastCalledWith(feature);
  });

  it("should remove listeners on unmount", () => {
    const wrapper = mount(<Mock geometry={[]} />);

    expect(map.data.addListener).toBeCalledTimes(instanceEvents);

    const {
      mock: { results },
    } = map.data.addListener as jest.Mock;

    results.forEach(({ value }) => {
      expect(value.remove).not.toBeCalled();
    });

    wrapper.unmount();

    results.forEach(({ value }) => {
      expect(value.remove).toBeCalled();
    });
  });
});

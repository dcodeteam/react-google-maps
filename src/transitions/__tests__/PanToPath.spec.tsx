import { mount } from "enzyme";
import * as React from "react";

import { createMockMapComponent } from "../../__tests__/testUtils";
import { PanToPath } from "../PanToPath";

describe("PanToPath", () => {
  const { map, Mock } = createMockMapComponent(PanToPath);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fit bounds on mount", () => {
    const path: google.maps.LatLngLiteral[] = [
      { lat: -2, lng: -2 },
      { lat: -1, lng: -1 },
      { lat: 1, lng: 1 },
      { lat: 2, lng: 2 },
    ];

    mount(<Mock path={path} />);

    expect(map.panToBounds).toBeCalledTimes(1);
    expect(map.panToBounds).lastCalledWith({
      east: 2,
      north: 2,
      south: -2,
      west: -2,
    });
  });

  it("should fit bounds on update", () => {
    const initialPath: google.maps.LatLngLiteral[] = [
      { lat: -2, lng: -2 },
      { lat: -1, lng: -1 },
      { lat: 1, lng: 1 },
      { lat: 2, lng: 2 },
    ];

    const updatedPath: google.maps.LatLngLiteral[] = [
      { lat: -3, lng: -3 },
      { lat: -2, lng: -2 },
      { lat: 2, lng: 2 },
      { lat: 3, lng: 3 },
    ];

    const wrapper = mount(<Mock path={initialPath} />);

    expect(map.panToBounds).toBeCalledTimes(1);

    wrapper.setProps({ path: initialPath });

    expect(map.panToBounds).toBeCalledTimes(1);

    wrapper.setProps({ path: updatedPath });

    expect(map.panToBounds).toBeCalledTimes(2);
    expect(map.panToBounds).lastCalledWith({
      east: 3,
      north: 3,
      south: -3,
      west: -3,
    });
  });
});

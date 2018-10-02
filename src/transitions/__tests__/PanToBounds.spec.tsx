import { mount } from "enzyme";
import * as React from "react";

import { createMockMapComponent } from "../../__tests__/testUtils";
import { PanToBounds } from "../PanToBounds";

describe("PanToBounds", () => {
  const { map, Mock } = createMockMapComponent(PanToBounds);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should pan to bounds on mount", () => {
    const bounds: google.maps.LatLngBoundsLiteral = {
      north: 1,
      east: 1,
      south: 2,
      west: 2,
    };

    mount(<Mock bounds={bounds} />);

    expect(map.panToBounds).toBeCalledTimes(1);
    expect(map.panToBounds).lastCalledWith(bounds);
  });

  it("should fit bounds on mount", () => {
    const initialBounds: google.maps.LatLngBoundsLiteral = {
      north: 1,
      east: 1,
      south: 2,
      west: 2,
    };
    const updatedBounds: google.maps.LatLngBoundsLiteral = {
      north: 3,
      east: 3,
      south: 4,
      west: 4,
    };

    const wrapper = mount(<Mock bounds={initialBounds} />);

    expect(map.panToBounds).toBeCalledTimes(1);

    wrapper.setProps({ bounds: initialBounds });

    expect(map.panToBounds).toBeCalledTimes(1);

    wrapper.setProps({ bounds: updatedBounds });

    expect(map.panToBounds).toBeCalledTimes(2);
    expect(map.panToBounds).lastCalledWith(updatedBounds);
  });
});

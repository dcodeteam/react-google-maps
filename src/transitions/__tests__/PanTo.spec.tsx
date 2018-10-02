import { mount } from "enzyme";
import * as React from "react";

import { createMockMapComponent } from "../../__tests__/testUtils";
import { PanTo } from "../PanTo";

describe("PanTo", () => {
  const { map, Mock } = createMockMapComponent(PanTo);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should pan on mount", () => {
    const position: google.maps.LatLngLiteral = { lat: 1, lng: 2 };

    mount(<Mock position={position} />);

    expect(map.panTo).toBeCalledTimes(1);
    expect(map.panTo).lastCalledWith(position);
  });

  it("should pan on update", () => {
    const initialPosition: google.maps.LatLngLiteral = { lat: 1, lng: 2 };
    const updatedPosition: google.maps.LatLngLiteral = { lat: 3, lng: 4 };

    const wrapper = mount(<Mock position={initialPosition} />);

    expect(map.panTo).toBeCalledTimes(1);

    wrapper.setProps({ position: initialPosition });

    expect(map.panTo).toBeCalledTimes(1);

    wrapper.setProps({ position: updatedPosition });

    expect(map.panTo).toBeCalledTimes(2);
    expect(map.panTo).lastCalledWith(updatedPosition);
  });
});

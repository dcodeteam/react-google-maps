import { mount } from "enzyme";
import * as React from "react";

import { createMockMapComponent } from "../../__tests__/testUtils";
import { PointLiteral } from "../../internal/MapsUtils";
import { PanBy } from "../PanBy";

describe("PanBy", () => {
  const { map, Mock } = createMockMapComponent(PanBy);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should pan on mount", () => {
    mount(<Mock offset={{ x: 1, y: 2 }} />);

    expect(map.panBy).toBeCalledTimes(1);
    expect(map.panBy).lastCalledWith(1, 2);
  });

  it("should pan on update", () => {
    const initialOffset: PointLiteral = { x: 1, y: 2 };
    const updatedOffset: PointLiteral = { x: 3, y: 4 };

    const wrapper = mount(<Mock offset={initialOffset} />);

    expect(map.panBy).toBeCalledTimes(1);

    wrapper.setProps({ offset: initialOffset });

    expect(map.panBy).toBeCalledTimes(1);

    wrapper.setProps({ offset: updatedOffset });

    expect(map.panBy).toBeCalledTimes(2);
    expect(map.panBy).lastCalledWith(updatedOffset.x, updatedOffset.y);
  });
});

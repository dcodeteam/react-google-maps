import { mount } from "enzyme";
import * as React from "react";

import { MapContextProvider } from "../../map/MapContext";
import { CustomControl, CustomControlProps } from "../CustomControl";

describe("CustomControl", () => {
  const map = new google.maps.Map(null);

  function MockCustomControl(props: CustomControlProps) {
    return (
      <MapContextProvider value={{ map, maps: google.maps }}>
        <CustomControl {...props} />
      </MapContextProvider>
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should set control on mount", () => {
    const controls = map.controls[google.maps.ControlPosition.TOP_LEFT];
    const ref = React.createRef<HTMLDivElement>();

    mount(
      <MockCustomControl position="TOP_LEFT">
        <div ref={ref}>Content</div>
      </MockCustomControl>,
    );

    expect(controls.push).toBeCalledTimes(1);
    expect(controls.push).lastCalledWith(ref.current!.parentElement);
  });

  it("should change control position on update", () => {
    const topLeftControls = map.controls[google.maps.ControlPosition.TOP_LEFT];
    const topRightControls =
      map.controls[google.maps.ControlPosition.TOP_RIGHT];

    const wrapper = mount(
      <MockCustomControl position="TOP_LEFT">
        <div>Content</div>
      </MockCustomControl>,
    );

    expect(wrapper.find("div").length).toBe(1);

    expect(topLeftControls.push).toBeCalledTimes(1);
    expect(topLeftControls.push).lastCalledWith(
      wrapper.find("div").getDOMNode().parentElement,
    );

    expect(topLeftControls.removeAt).toBeCalledTimes(0);
    expect(topRightControls.push).toBeCalledTimes(0);
    expect(topRightControls.removeAt).toBeCalledTimes(0);

    wrapper.setProps({ position: "TOP_LEFT" });

    expect(topLeftControls.push).toBeCalledTimes(1);
    expect(topLeftControls.removeAt).toBeCalledTimes(0);
    expect(topRightControls.push).toBeCalledTimes(0);
    expect(topRightControls.removeAt).toBeCalledTimes(0);

    wrapper.setProps({ position: "TOP_RIGHT" });

    expect(topLeftControls.push).toBeCalledTimes(1);
    expect(topLeftControls.removeAt).toBeCalledTimes(1);
    expect(topRightControls.push).toBeCalledTimes(1);
    expect(topRightControls.push).lastCalledWith(
      wrapper.find("div").getDOMNode().parentElement,
    );
    expect(topRightControls.removeAt).toBeCalledTimes(0);
  });

  it("should change children", () => {
    const wrapper = mount(
      <MockCustomControl position="TOP_LEFT">
        <div>Content</div>
      </MockCustomControl>,
    );

    const initialDiv = wrapper.find("div");

    expect(initialDiv.length).toBe(1);
    expect(initialDiv.html()).toBe("<div>Content</div>");

    wrapper.setProps({ children: "Plain text" });

    expect(wrapper.find("div").length).toBe(0);
    expect(wrapper.text()).toBe("Plain text");
  });

  it("should remove node on unmount", () => {
    const topLeftControls = map.controls[google.maps.ControlPosition.TOP_LEFT];

    const wrapper = mount(
      <MockCustomControl position="TOP_LEFT">
        <div>Content</div>
      </MockCustomControl>,
    );

    expect(topLeftControls.push).toBeCalledTimes(1);
    expect(topLeftControls.removeAt).toBeCalledTimes(0);

    wrapper.unmount();

    expect(topLeftControls.push).toBeCalledTimes(1);
    expect(topLeftControls.removeAt).toBeCalledTimes(1);
  });

  it("should remove control only if it attached", () => {
    const topLeftControls = map.controls[google.maps.ControlPosition.TOP_LEFT];

    topLeftControls.clear();

    const wrapper = mount(
      <MockCustomControl position="TOP_LEFT">
        <div>Content</div>
      </MockCustomControl>,
    );

    expect(topLeftControls.push).toBeCalledTimes(1);
    expect(topLeftControls.removeAt).toBeCalledTimes(0);

    topLeftControls.removeAt(0);

    wrapper.unmount();

    expect(topLeftControls.push).toBeCalledTimes(1);
    expect(topLeftControls.removeAt).toBeCalledTimes(1);
  });
});

import { mount } from "enzyme";
import * as React from "react";

import {
  createMockMapComponent,
  emitEvent,
  getClassMockInstance,
} from "../../__tests__/testUtils";
import { InfoWindow } from "../InfoWindow";
import { InfoWindowEvent } from "../InfoWindowEvent";

function getMockInstance(): google.maps.InfoWindow {
  return getClassMockInstance(google.maps.InfoWindow);
}

describe("InfoWindow", () => {
  const { map, Mock } = createMockMapComponent(InfoWindow);

  const customEvents = 1;
  const instanceEvents = Object.keys(InfoWindowEvent).length;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should set default options on mount", () => {
    mount(<Mock position={{ lat: 0, lng: 1 }}>Content</Mock>);

    const infoWindow = getMockInstance();

    expect(infoWindow.setOptions).toBeCalledTimes(1);
    expect(infoWindow.setOptions).lastCalledWith({
      disableAutoPan: false,
      maxWidth: undefined,
      pixelOffset: undefined,
      position: { lat: 0, lng: 1 },
      zIndex: undefined,
    });

    expect(infoWindow.open).toBeCalledTimes(1);
    expect(infoWindow.open).lastCalledWith(map);

    expect(infoWindow.close).toBeCalledTimes(0);

    expect(infoWindow.setOptions).toBeCalledTimes(1);
    expect(infoWindow.setOptions).lastCalledWith({
      disableAutoPan: false,
      position: { lat: 0, lng: 1 },
    });
  });

  it("should open info window by default on mount", () => {
    mount(<Mock position={{ lat: 0, lng: 1 }}>Content</Mock>);

    const infoWindow = getMockInstance();

    expect(infoWindow.close).toBeCalledTimes(0);
    expect(infoWindow.open).toBeCalledTimes(1);
    expect(infoWindow.open).lastCalledWith(map);
  });

  it("should NOT open info window on mount if open is 'false'", () => {
    mount(
      <Mock open={false} position={{ lat: 0, lng: 1 }}>
        Content
      </Mock>,
    );

    const infoWindow = getMockInstance();

    expect(infoWindow.open).toBeCalledTimes(0);
    expect(infoWindow.close).toBeCalledTimes(0);
  });

  it("should set custom options on mount", () => {
    mount(
      <Mock
        open={false}
        maxWidth={120}
        zIndex={10}
        disableAutoPan={true}
        position={{ lat: 0, lng: 1 }}
        pixelOffset={{ width: 0, height: 1 }}
      >
        Content
      </Mock>,
    );

    const infoWindow = getMockInstance();

    expect(infoWindow.setOptions).toBeCalledTimes(1);
    expect(infoWindow.setOptions).lastCalledWith({
      disableAutoPan: true,
      maxWidth: 120,
      pixelOffset: { height: 1, width: 0 },
      position: { lat: 0, lng: 1 },
      zIndex: 10,
    });
  });

  it("should change options on update", () => {
    const wrapper = mount(<Mock position={{ lat: 0, lng: 1 }}>Content</Mock>);

    const infoWindow = getMockInstance();

    expect(infoWindow.setOptions).toBeCalledTimes(1);
    expect(infoWindow.setOptions).lastCalledWith({
      disableAutoPan: false,
      position: { lat: 0, lng: 1 },
    });

    wrapper.setProps({ zIndex: 10 });

    expect(infoWindow.setOptions).toBeCalledTimes(2);
    expect(infoWindow.setOptions).lastCalledWith({ zIndex: 10 });

    wrapper.setProps({ zIndex: 10 });

    expect(infoWindow.setOptions).toBeCalledTimes(2);

    wrapper.setProps({ zIndex: 20 });

    expect(infoWindow.setOptions).lastCalledWith({ zIndex: 20 });
  });

  it("should change visibility on update", () => {
    const wrapper = mount(<Mock position={{ lat: 0, lng: 1 }}>Content</Mock>);

    const infoWindow = getMockInstance();

    expect(infoWindow.open).toBeCalledTimes(1);
    expect(infoWindow.close).toBeCalledTimes(0);

    wrapper.setProps({ open: false });

    expect(infoWindow.open).toBeCalledTimes(1);
    expect(infoWindow.close).toBeCalledTimes(1);

    wrapper.setProps({ open: false });

    expect(infoWindow.open).toBeCalledTimes(1);
    expect(infoWindow.close).toBeCalledTimes(1);

    wrapper.setProps({ open: true });

    expect(infoWindow.open).toBeCalledTimes(2);
    expect(infoWindow.open).lastCalledWith(map);

    expect(infoWindow.close).toBeCalledTimes(1);
  });

  it("should reopen window when it's opened and 'maxWidth' has changed", () => {
    const wrapper = mount(<Mock position={{ lat: 0, lng: 1 }}>Content</Mock>);

    const infoWindow = getMockInstance();

    expect(infoWindow.open).toBeCalledTimes(1);
    expect(infoWindow.open).lastCalledWith(map);

    wrapper.setProps({ maxWidth: 300 });

    expect(infoWindow.open).toBeCalledTimes(2);
    expect(infoWindow.open).lastCalledWith(map);

    wrapper.setProps({ maxWidth: 300 });

    expect(infoWindow.open).toBeCalledTimes(2);

    wrapper.setProps({ maxWidth: 200 });

    expect(infoWindow.open).toBeCalledTimes(3);
    expect(infoWindow.open).lastCalledWith(map);

    expect(infoWindow.close).toBeCalledTimes(0);
  });

  it("should NOT reopen window when it's closed and 'maxWidth' has changed", () => {
    const wrapper = mount(<Mock position={{ lat: 0, lng: 1 }}>Content</Mock>);

    const infoWindow = getMockInstance();

    expect(infoWindow.open).toBeCalledTimes(1);
    expect(infoWindow.open).lastCalledWith(map);

    wrapper.setProps({ open: false, maxWidth: 300 });

    expect(infoWindow.open).toBeCalledTimes(1);
    expect(infoWindow.close).toBeCalledTimes(1);

    wrapper.setProps({ maxWidth: 300 });

    expect(infoWindow.open).toBeCalledTimes(1);

    wrapper.setProps({ maxWidth: 200 });

    expect(infoWindow.open).toBeCalledTimes(1);
    expect(infoWindow.close).toBeCalledTimes(1);
  });

  it("should attach listeners without handlers", () => {
    mount(<Mock position={{ lat: 0, lng: 1 }}>Content</Mock>);

    const infoWindow = getMockInstance();

    expect(infoWindow.addListener).toBeCalledTimes(
      customEvents + instanceEvents,
    );
  });

  it("should attach listeners with handlers", () => {
    const onCloseClick = jest.fn();

    mount(
      <Mock position={{ lat: 0, lng: 1 }} onCloseClick={onCloseClick}>
        Content
      </Mock>,
    );

    const infoWindow = getMockInstance();

    expect(onCloseClick).toBeCalledTimes(0);

    emitEvent(infoWindow, InfoWindowEvent.onCloseClick);

    expect(onCloseClick).toBeCalledTimes(1);
  });

  it("should reopen info window on close when it should be open", () => {
    mount(<Mock position={{ lat: 0, lng: 1 }}>Content</Mock>);

    const infoWindow = getMockInstance();

    expect(infoWindow.open).toBeCalledTimes(1);
    expect(infoWindow.open).lastCalledWith(map);

    emitEvent(infoWindow, InfoWindowEvent.onCloseClick);

    expect(infoWindow.open).toBeCalledTimes(2);
    expect(infoWindow.open).lastCalledWith(map);
  });

  it("should render string content", () => {
    const wrapper = mount(<Mock position={{ lat: 0, lng: 1 }}>Content</Mock>);

    const infoWindow = getMockInstance();

    expect(infoWindow.setContent).toBeCalledTimes(1);
    expect(infoWindow.setContent).lastCalledWith("Content");

    wrapper.setProps({ children: "Another Content" });

    expect(infoWindow.setContent).toBeCalledTimes(2);
    expect(infoWindow.setContent).lastCalledWith("Another Content");

    wrapper.setProps({ children: "Another Content" });

    expect(infoWindow.setContent).toBeCalledTimes(2);

    wrapper.setProps({ children: "Content" });

    expect(infoWindow.setContent).toBeCalledTimes(3);
    expect(infoWindow.setContent).lastCalledWith("Content");
  });

  it("should render react portal if child is react element", () => {
    const ref = React.createRef<HTMLDivElement>();

    const wrapper = mount(
      <Mock position={{ lat: 0, lng: 1 }}>
        <div ref={ref}>React Element</div>
      </Mock>,
    );

    const infoWindow = getMockInstance();

    expect(infoWindow.setContent).toBeCalledTimes(1);
    expect(infoWindow.setContent).lastCalledWith(ref.current!.parentElement);

    wrapper.setProps({ children: <div ref={ref}>Another React Element</div> });

    expect(infoWindow.setContent).toBeCalledTimes(2);
    expect(infoWindow.setContent).lastCalledWith(ref.current!.parentElement);
  });

  it("should unmount portal on close", () => {
    const wrapper = mount(<Mock position={{ lat: 0, lng: 1 }}>Content</Mock>);

    const infoWindow = getMockInstance();

    expect(infoWindow.close).toBeCalledTimes(0);
    expect(google.maps.event.clearInstanceListeners).toBeCalledTimes(0);

    const {
      mock: { results },
    } = infoWindow.addListener as jest.Mock;

    expect(results.length).toBe(customEvents + instanceEvents);

    wrapper.unmount();

    results.forEach(({ value }) => {
      expect(value.remove).toBeCalled();
    });

    expect(infoWindow.close).toBeCalledTimes(1);
    expect(google.maps.event.clearInstanceListeners).toBeCalledTimes(1);
    expect(google.maps.event.clearInstanceListeners).lastCalledWith(infoWindow);
  });
});

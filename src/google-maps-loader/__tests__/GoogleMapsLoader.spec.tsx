import { mount } from "enzyme";
import * as React from "react";

import { loadScript } from "../../internal/DOMUtils";
import { GoogleMapsLoader } from "../GoogleMapsLoader";

jest.mock("../../internal/DOMUtils", () => ({
  loadScript: jest.fn(
    (
      _src: string,
      onResolve?: () => void,
      onReject?: (error: Error) => void,
    ) => ({
      resolve: () => {
        if (onResolve) {
          onResolve();
        }
      },
      reject: (error: Error) => {
        if (onReject) {
          onReject(error);
        }
      },
    }),
  ),
}));

describe("GoogleMapsLoader", () => {
  // eslint-disable-next-line typescript/no-explicit-any
  const win = window as any;

  function createGoogleMapsMock() {
    const originalKeys = Object.keys(window);
    const realGoogle = win.google;

    delete win.google;

    return () => {
      const newKeys = Object.keys(window).filter(
        x => !originalKeys.includes(x),
      );

      win.google = realGoogle;

      if (newKeys.length > 0) {
        const [initKey] = newKeys;
        const init = win[initKey];

        init();
      }
    };
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should start loading on mount", () => {
    const mockLoad = createGoogleMapsMock();
    const render = jest.fn(() => null);
    const wrapper = mount(
      <GoogleMapsLoader apiKey="SOME_SECRET" render={render} />,
    );

    expect(render).toBeCalledTimes(0);
    expect(loadScript).toBeCalledTimes(1);
    expect(loadScript).lastCalledWith(
      expect.any(String),
      expect.stringContaining("key=SOME_SECRET"),
    );

    expect(wrapper.find("div").length).toBe(0);

    mockLoad();

    expect(render).toBeCalledTimes(1);
  });

  it("should not change state on unmounted component", () => {
    const mockLoad = createGoogleMapsMock();
    const logSpy = jest.spyOn(console, "error");
    const render = jest.fn(() => null);
    const wrapper = mount(
      <GoogleMapsLoader apiKey="SOME_SECRET" render={render} />,
    );

    wrapper.unmount();

    mockLoad();

    expect(logSpy).toBeCalledTimes(0);

    logSpy.mockRestore();
  });

  it("should not load if maps defined", () => {
    const render = jest.fn(() => null);

    mount(<GoogleMapsLoader render={render} apiKey="SOME_SECRET" />);

    expect(loadScript).toBeCalledTimes(0);
    expect(render).toBeCalledTimes(1);
    expect(render).lastCalledWith(google.maps);
  });

  it("should call onLoadStart on mount", () => {
    const render = jest.fn(() => null);
    const onLoadStart = jest.fn();

    mount(
      <GoogleMapsLoader
        render={render}
        apiKey="SOME_SECRET"
        onLoadStart={onLoadStart}
      />,
    );

    expect(onLoadStart).toBeCalledTimes(1);
  });

  it("should call onLoadSuccess on success load", () => {
    const render = jest.fn(() => null);
    const onLoadSuccess = jest.fn();

    mount(
      <GoogleMapsLoader
        render={render}
        apiKey="SOME_SECRET"
        onLoadSuccess={onLoadSuccess}
      />,
    );

    expect(onLoadSuccess).toBeCalledTimes(1);
  });
});

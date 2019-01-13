import React from "react";
import { render } from "react-testing-library";

import {
  useGoogleMap,
  useGoogleMapMarker,
  useGoogleMapsAPI,
} from "../GoogleMapsContext";

describe("useGoogleMapsAPI", () => {
  it("throws when context not provided", () => {
    const Component = () => {
      useGoogleMapsAPI();

      return null;
    };

    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => render(<Component />)).toThrowErrorMatchingInlineSnapshot(
      `"Could not find 'maps' in the context. Wrap the root component in an <GoogleMapsAPIContext.Provider>."`,
    );
    expect(consoleErrorMock).toBeCalledTimes(2);
    expect(consoleErrorMock.mock.calls[0][1]).toMatchInlineSnapshot(
      `[Error: Could not find 'maps' in the context. Wrap the root component in an <GoogleMapsAPIContext.Provider>.]`,
    );
    expect(consoleErrorMock.mock.calls[1][0]).toMatchInlineSnapshot(`
"The above error occurred in the <Component> component:
    in Component

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://fb.me/react-error-boundaries to learn more about error boundaries."
`);

    consoleErrorMock.mockRestore();
  });
});

describe("useGoogleMap", () => {
  it("throws when context not provided", () => {
    const Component = () => {
      useGoogleMap();

      return null;
    };

    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => render(<Component />)).toThrowErrorMatchingInlineSnapshot(
      `"Could not find 'map' in the context. Wrap the root component in an <Map>."`,
    );
    expect(consoleErrorMock).toBeCalledTimes(2);
    expect(consoleErrorMock.mock.calls[0][1]).toMatchInlineSnapshot(
      `[Error: Could not find 'map' in the context. Wrap the root component in an <Map>.]`,
    );
    expect(consoleErrorMock.mock.calls[1][0]).toMatchInlineSnapshot(`
"The above error occurred in the <Component> component:
    in Component

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://fb.me/react-error-boundaries to learn more about error boundaries."
`);

    consoleErrorMock.mockRestore();
  });
});

describe("useGoogleMapMarker", () => {
  it("throws when context not provided", () => {
    const Component = () => {
      useGoogleMapMarker();

      return null;
    };

    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => render(<Component />)).toThrowErrorMatchingInlineSnapshot(
      `"Could not find 'marker' in the context. Wrap the root component in an <Marker>."`,
    );
    expect(consoleErrorMock).toBeCalledTimes(2);
    expect(consoleErrorMock.mock.calls[0][1]).toMatchInlineSnapshot(
      `[Error: Could not find 'marker' in the context. Wrap the root component in an <Marker>.]`,
    );
    expect(consoleErrorMock.mock.calls[1][0]).toMatchInlineSnapshot(`
"The above error occurred in the <Component> component:
    in Component

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://fb.me/react-error-boundaries to learn more about error boundaries."
`);

    consoleErrorMock.mockRestore();
  });
});

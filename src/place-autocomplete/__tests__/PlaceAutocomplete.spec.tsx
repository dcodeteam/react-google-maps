import { mount, shallow } from "enzyme";
import * as React from "react";

import { emitEvent, getClassMockInstance } from "../../__tests__/testUtils";
import { PlaceAutocomplete } from "../PlaceAutocomplete";
import { PlaceAutocompleteEvent } from "../PlaceAutocompleteEvent";

function getMockInstance(): google.maps.places.Autocomplete {
  return getClassMockInstance(google.maps.places.Autocomplete);
}

describe("PlaceAutocomplete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should connect to rendered input", () => {
    const wrapper = mount(
      <PlaceAutocomplete
        maps={google.maps}
        render={({ ref }) => <input ref={ref} type="text" />}
      />,
    );

    const inputWrapper = wrapper.find("input");

    const autocomplete = getMockInstance();

    expect(inputWrapper.length).toBe(1);
    expect(autocomplete.get("input")).toBe(inputWrapper.getDOMNode());
  });

  it("should set default options on mount", () => {
    shallow(
      <PlaceAutocomplete
        maps={google.maps}
        render={({ ref }) => <input ref={ref} type="text" />}
      />,
    );

    const autocomplete = getMockInstance();

    expect(autocomplete.setValues).toBeCalledTimes(1);
    expect(autocomplete.setValues).lastCalledWith({
      componentRestrictions: undefined,
      placeIdOnly: false,
      strictBounds: false,
      types: undefined,
    });
  });

  it("should set custom options on mount", () => {
    shallow(
      <PlaceAutocomplete
        maps={google.maps}
        placeIdOnly={true}
        strictBounds={true}
        types={["geocode"]}
        componentRestrictions={{ country: "USA" }}
        bounds={{ east: -96, north: 37, south: 31, west: -112 }}
        render={({ ref }) => <input ref={ref} type="text" />}
      />,
    );

    const autocomplete = getMockInstance();

    expect(autocomplete.setValues).toBeCalledTimes(1);
    expect(autocomplete.setValues).lastCalledWith({
      bounds: { east: -96, north: 37, south: 31, west: -112 },
      componentRestrictions: { country: "USA" },
      placeIdOnly: true,
      strictBounds: true,
      types: ["geocode"],
    });
  });

  it("should add listeners without handlers", () => {
    shallow(
      <PlaceAutocomplete
        maps={google.maps}
        render={({ ref }) => <input ref={ref} type="text" />}
      />,
    );

    const autocomplete = getMockInstance();

    expect(autocomplete.addListener).toBeCalledTimes(1);

    expect(() => {
      emitEvent(autocomplete, PlaceAutocompleteEvent.onPlaceChanged);
    }).not.toThrow();
  });

  it("should add listeners with handlers", () => {
    const onPlaceChanged = jest.fn();

    shallow(
      <PlaceAutocomplete
        maps={google.maps}
        onPlaceChanged={onPlaceChanged}
        render={({ ref }) => <input ref={ref} type="text" />}
      />,
    );

    const place = {};
    const autocomplete = getMockInstance();

    expect(autocomplete.addListener).toBeCalledTimes(1);

    expect(onPlaceChanged).toBeCalledTimes(0);

    autocomplete.set("place", place);

    emitEvent(autocomplete, PlaceAutocompleteEvent.onPlaceChanged);

    expect(onPlaceChanged).toBeCalledTimes(1);
    expect(onPlaceChanged).lastCalledWith(place);
  });

  it("should change options on update", () => {
    const wrapper = shallow(
      <PlaceAutocomplete
        maps={google.maps}
        render={({ ref }) => <input ref={ref} type="text" />}
      />,
    );

    const autocomplete = getMockInstance();

    expect(autocomplete.setValues).toBeCalledTimes(1);

    wrapper.setProps({ placeIdOnly: false });

    expect(autocomplete.setValues).toBeCalledTimes(1);

    wrapper.setProps({ placeIdOnly: true });

    expect(autocomplete.setValues).toBeCalledTimes(2);
    expect(autocomplete.setValues).lastCalledWith({ placeIdOnly: true });
  });

  it("should clear all listeners on unmount", () => {
    const wrapper = shallow(
      <PlaceAutocomplete
        maps={google.maps}
        render={({ ref }) => <input ref={ref} type="text" />}
      />,
    );

    const autocomplete = getMockInstance();

    expect(google.maps.event.clearInstanceListeners).toBeCalledTimes(0);

    wrapper.unmount();

    expect(google.maps.event.clearInstanceListeners).toBeCalledTimes(1);
    expect(google.maps.event.clearInstanceListeners).lastCalledWith(
      autocomplete,
    );
  });
});

import { ReactElement, RefObject, useEffect, useRef, useState } from "react";

import { useGoogleMapsAPI } from "../context/GoogleMapsContext";
import { useDeepCompareMemo } from "../internal/useDeepCompareMemo";
import { useEventHandlers } from "../internal/useEventHandlers";
import { PlaceAutocompleteEvent } from "./PlaceAutocompleteEvent";

export interface PlaceAutocompleteRenderProps {
  ref: RefObject<HTMLInputElement>;
}

export interface PlaceAutocompleteProps {
  /**
   * The area in which to search for places.
   */
  bounds?: google.maps.LatLngBoundsLiteral;

  /**
   * The component restrictions. Component restrictions are used to restrict
   * predictions to only those within the parent component.
   */
  componentRestrictions?: google.maps.places.ComponentRestrictions;

  /**
   * Whether to retrieve only Place IDs. The PlaceResult made available when
   * the place_changed event is fired will only have the place_id, types and
   * name fields, with the place_id, types and description returned by the
   * Autocomplete service.
   */
  placeIdOnly?: boolean;

  /**
   * A boolean value, indicating that the Autocomplete widget should only return
   * those places that are inside the bounds of the Autocomplete widget at the
   * time the query is sent. Setting strictBounds to false will make the results
   * biased towards, but not restricted to, places contained within the bounds.
   */
  strictBounds?: boolean;

  /**
   * The types of predictions to be returned. For a list of supported types,
   * see the developer's guide. If nothing is specified, all types are returned.
   * In general only a single type is allowed. The exception is that you can
   * safely mix the 'geocode' and 'establishment' types, but note that this
   * will have the same effect as specifying no types.
   */
  types?: Array<string>;

  /**
   * This event is fired when a PlaceResult is made available for a Place the
   * user has selected. If the user enters the name of a Place that was not
   * suggested by the control and presses the Enter key, or if a Place Details
   * request fails, the PlaceResult contains the user input in the name
   * property, with no other properties defined.
   */
  onPlaceChanged?(result: google.maps.places.PlaceResult): void;

  /**
   * Renders child component with provided input.
   */
  render(
    renderProps: PlaceAutocompleteRenderProps,
  ): null | ReactElement<object>;
}

type Handlers = Pick<PlaceAutocompleteProps, "onPlaceChanged">;

export function PlaceAutocomplete({
  render,
  types,
  bounds,
  componentRestrictions,
  placeIdOnly = false,
  strictBounds = false,

  onPlaceChanged,
}: PlaceAutocompleteProps): null | ReactElement<object> {
  const maps = useGoogleMapsAPI();
  const inputRef = useRef<HTMLInputElement>(null);
  const [
    autocomplete,
    setAutocomplete,
  ] = useState<null | google.maps.places.Autocomplete>(null);
  const options = useDeepCompareMemo(
    () => ({
      types,
      bounds,
      placeIdOnly,
      strictBounds,
      componentRestrictions,
    }),
    [types, bounds, placeIdOnly, strictBounds, componentRestrictions],
  );

  useEffect(() => {
    setAutocomplete(new maps.places.Autocomplete(inputRef.current!));
  }, []);

  useEffect(() => {
    if (autocomplete) {
      autocomplete.setValues(options);
    }
  }, [autocomplete, options]);

  useEventHandlers<Handlers>(autocomplete, PlaceAutocompleteEvent, {
    onPlaceChanged() {
      if (onPlaceChanged) {
        onPlaceChanged(autocomplete!.getPlace());
      }
    },
  });

  return render({ ref: inputRef });
}

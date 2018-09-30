import * as React from "react";

import { pickChangedProps } from "../internal/PropsUtils";
import { PlaceAutocompleteEvent } from "./PlaceAutocompleteEvent";

export interface PlaceAutocompleteRenderProps {
  ref: (node: null | HTMLInputElement) => void;
}

export interface PlaceAutocompleteProps {
  maps: typeof google.maps;

  /**
   * Bind the map's bounds (viewport) property to the autocomplete object,
   * so that the autocomplete requests use the current map bounds for the
   * bounds option in the request.
   */
  map?: google.maps.Map;

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
  types?: string[];

  /**
   * This event is fired when a PlaceResult is made available for a Place the
   * user has selected. If the user enters the name of a Place that was not
   * suggested by the control and presses the Enter key, or if a Place Details
   * request fails, the PlaceResult contains the user input in the name
   * property, with no other properties defined.
   */
  onPlaceChanged?: (result: google.maps.places.PlaceResult) => void;

  /**
   * Renders child component with provided input.
   */
  render: (renderProps: PlaceAutocompleteRenderProps) => React.ReactNode;
}

function createPlaceAutocompleteOptions({
  types,
  bounds,
  placeIdOnly = false,
  strictBounds = false,
  componentRestrictions,
}: PlaceAutocompleteProps): google.maps.places.AutocompleteOptions {
  return {
    types,
    bounds,
    placeIdOnly,
    strictBounds,
    componentRestrictions,
  };
}

export class PlaceAutocomplete extends React.Component<PlaceAutocompleteProps> {
  private ref: null | HTMLInputElement = null;

  private autocomplete?: google.maps.places.Autocomplete;

  private renderProps: PlaceAutocompleteRenderProps = {
    ref: node => {
      this.ref = node;
    },
  };

  public componentDidMount(): void {
    const { maps } = this.props;
    const options = createPlaceAutocompleteOptions(this.props);
    const autocomplete = new maps.places.Autocomplete(this.ref!);

    autocomplete.setValues(options);
    autocomplete.addListener(PlaceAutocompleteEvent.onPlaceChanged, () => {
      const { onPlaceChanged } = this.props;

      if (onPlaceChanged) {
        onPlaceChanged(autocomplete.getPlace());
      }
    });

    this.autocomplete = autocomplete;
  }

  public componentDidUpdate(prevProps: Readonly<PlaceAutocompleteProps>): void {
    const prevOptions = createPlaceAutocompleteOptions(prevProps);
    const nextOptions = createPlaceAutocompleteOptions(this.props);
    const options = pickChangedProps(prevOptions, nextOptions);

    if (options) {
      this.autocomplete!.setValues(options);
    }
  }

  public componentWillUnmount(): void {
    const { maps } = this.props;

    maps.event.clearInstanceListeners(this.autocomplete!);
  }

  public render() {
    const { render } = this.props;

    return render(this.renderProps);
  }
}

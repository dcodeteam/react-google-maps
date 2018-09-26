import * as React from "react";

import { MapComponent } from "../google-map-component/MapComponent";
import { isShallowEqual } from "../internal/DataUtils";

export interface FitBoundsProps {
  /**
   * Rectangle from the points at its south-west and north-east corners.
   */
  latLngBounds: google.maps.LatLngBoundsLiteral;
}

export function FitBounds({ latLngBounds }: FitBoundsProps) {
  return (
    <MapComponent
      createOptions={() => latLngBounds}
      didMount={({ map, options }) => {
        map.fitBounds(options);
      }}
      didUpdate={({ options: prevOptions }, { map, options: nextOptions }) => {
        if (!isShallowEqual(prevOptions, nextOptions)) {
          map.fitBounds(nextOptions);
        }
      }}
    />
  );
}

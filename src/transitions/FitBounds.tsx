import * as React from "react";

import { GoogleMapContext } from "../google-map/GoogleMapContext";
import { isShallowEqual } from "../internal/DataUtils";
import { createLatLngBounds } from "../internal/MapsUtils";
import { MapComponent } from "../map-component/MapComponent";

export interface FitBoundsProps {
  /**
   * Rectangle from the points at its south-west and north-east corners.
   */
  bounds: google.maps.LatLngBoundsLiteral;
}

export function FitBounds({ bounds }: FitBoundsProps) {
  return (
    <MapComponent
      createOptions={({ maps }: GoogleMapContext) =>
        createLatLngBounds(maps, bounds)
      }
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

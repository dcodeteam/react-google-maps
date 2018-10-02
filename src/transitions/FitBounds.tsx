import * as React from "react";

import { isShallowEqual } from "../internal/DataUtils";
import { createLatLngBounds } from "../internal/MapsUtils";
import { MapComponent } from "../map-component/MapComponent";
import { MapContext } from "../map/MapContext";

export interface FitBoundsProps {
  /**
   * Rectangle from the points at its south-west and north-east corners.
   */
  bounds: google.maps.LatLngBoundsLiteral;
}

export function FitBounds(props: FitBoundsProps) {
  return (
    <MapComponent
      createOptions={({ maps }: MapContext) =>
        createLatLngBounds(maps, props.bounds)
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

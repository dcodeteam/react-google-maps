import * as React from "react";

import { MapComponent } from "../google-map-component/MapComponent";
import { isShallowEqual } from "../internal/DataUtils";

export interface PanToBoundsProps {
  /**
   * Rectangle from the points at its south-west and north-east corners.
   */
  latLngBounds: google.maps.LatLngBoundsLiteral;
}

export function PanToBounds({ latLngBounds }: PanToBoundsProps) {
  return (
    <MapComponent
      createOptions={() => latLngBounds}
      didMount={({ map, options }) => {
        map.panToBounds(options);
      }}
      didUpdate={({ options: prevOptions }, { map, options: nextOptions }) => {
        if (!isShallowEqual(prevOptions, nextOptions)) {
          map.panToBounds(nextOptions);
        }
      }}
    />
  );
}

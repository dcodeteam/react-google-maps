import * as React from "react";

import { MapComponent } from "../google-map-component/MapComponent";
import { isShallowEqual } from "../internal/DataUtils";

export interface PanToProps {
  /**
   * Defines the next map center position.
   */
  latLng: google.maps.LatLngLiteral;
}

export function PanTo({ latLng }: PanToProps) {
  return (
    <MapComponent
      createOptions={() => latLng}
      didMount={({ map, options }) => {
        map.panTo(options);
      }}
      didUpdate={({ options: prevOptions }, { map, options: nextOptions }) => {
        if (!isShallowEqual(prevOptions, nextOptions)) {
          map.panTo(nextOptions);
        }
      }}
    />
  );
}

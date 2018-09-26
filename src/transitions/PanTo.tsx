import * as React from "react";

import { isShallowEqual } from "../internal/DataUtils";
import { MapComponent } from "../map-component/MapComponent";

export interface PanToProps {
  /**
   * Defines the next map center position.
   */
  position: google.maps.LatLngLiteral;
}

export function PanTo({ position }: PanToProps) {
  return (
    <MapComponent
      createOptions={() => position}
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

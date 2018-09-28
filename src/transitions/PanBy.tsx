import * as React from "react";

import { PointLiteral } from "../internal/MapsUtils";
import { MapComponent } from "../map-component/MapComponent";

export interface PanByProps {
  /**
   * Defines the distance to coordinate from west to east and north to south in pixels.
   */
  offset: PointLiteral;
}

export function PanBy(props: PanByProps) {
  return (
    <MapComponent
      createOptions={() => props.offset}
      didMount={({ map, options }) => {
        map.panBy(options.x, options.y);
      }}
      didUpdate={({ options: prevOptions }, { map, options: nextOptions }) => {
        if (
          prevOptions.x !== nextOptions.x ||
          prevOptions.y !== nextOptions.y
        ) {
          map.panBy(nextOptions.x, nextOptions.y);
        }
      }}
    />
  );
}

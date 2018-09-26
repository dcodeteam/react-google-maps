import * as React from "react";

import { MapComponent } from "../google-map-component/MapComponent";

export interface PanByProps {
  /**
   * Defines the distance to coordinate from west to east in pixels.
   */
  x: number;
  /**
   * Defines the distance to coordinate from north to south in pixels.
   */
  y: number;
}

export function PanBy(props: PanByProps) {
  return (
    <MapComponent
      createOptions={() => props}
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

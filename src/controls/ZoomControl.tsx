import * as React from "react";

import { MapControl, MapControlPosition } from "./internal/MapControl";

export interface ZoomControlProps {
  /**
   * Position id. Used to specify the position of the control on the map.
   */
  position?: MapControlPosition;
}

export function ZoomControl({ position = "TOP_LEFT" }: ZoomControlProps) {
  return (
    <MapControl
      createControl={maps => ({
        name: "zoomControl",
        options: { position: position && maps.ControlPosition[position] },
      })}
    />
  );
}

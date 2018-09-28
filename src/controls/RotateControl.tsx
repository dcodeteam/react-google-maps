import * as React from "react";

import { MapControl, MapControlPosition } from "./internal/MapControl";

export interface RotateControlProps {
  /**
   * Position id. Used to specify the position of the control on the map.
   */
  position?: MapControlPosition;
}

export function RotateControl({ position = "TOP_LEFT" }: RotateControlProps) {
  return (
    <MapControl
      createControl={maps => ({
        name: "rotateControl",
        options: { position: position && maps.ControlPosition[position] },
      })}
    />
  );
}

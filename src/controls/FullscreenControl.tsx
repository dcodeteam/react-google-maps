import * as React from "react";

import { MapControl, MapControlPosition } from "./internal/MapControl";

export interface FullscreenControlProps {
  /**
   * Position id. Used to specify the position of the control on the map.
   */
  position?: MapControlPosition;
}

export function FullscreenControl({
  position = "RIGHT_TOP",
}: FullscreenControlProps) {
  return (
    <MapControl
      createControl={maps => ({
        name: "fullscreenControl",
        options: { position: position && maps.ControlPosition[position] },
      })}
    />
  );
}

import * as React from "react";

import { MapControl, MapControlPosition } from "./internal/MapControl";

export interface StreetViewControlProps {
  /**
   * Position id. Used to specify the position of the control on the map. The
   * default position is embedded within the navigation (zoom and pan)
   * controls. If this position is empty or the same as that specified in the
   * zoomControlOptions or panControlOptions, the Street View control will be
   * displayed as part of the navigation controls. Otherwise, it will be
   * displayed separately.
   */
  position?: MapControlPosition;
}

export function StreetViewControl({
  position = "TOP_LEFT",
}: StreetViewControlProps) {
  return (
    <MapControl
      createControl={maps => ({
        name: "streetViewControl",
        options: { position: position && maps.ControlPosition[position] },
      })}
    />
  );
}

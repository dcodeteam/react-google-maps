import { useEffect } from "react";

import { useGoogleMap } from "../context/GoogleMapsContext";
import { PointLiteral } from "../internal/MapsUtils";

export interface PanByProps {
  /**
   * Defines the distance to coordinate from west to east and north to south in pixels.
   */
  offset: PointLiteral;
}

export function PanBy({ offset: { x, y } }: PanByProps): null {
  const map = useGoogleMap();

  useEffect(() => {
    map.panBy(x, y);
  }, [x, y]);

  return null;
}

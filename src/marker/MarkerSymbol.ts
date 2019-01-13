import { useEffect } from "react";

import { PointLiteral, createPoint } from "../internal/MapsUtils";
import { useDeepCompareMemo } from "../internal/useDeepCompareMemo";
import { useGoogleMapMarker, useGoogleMapsAPI } from "..";

export interface MarkerSymbolProps {
  /**
   * Built-in symbol path, or a custom path expressed using
   * [SVG path notation](http://www.w3.org/TR/SVG/paths.html#PathData).
   */
  path: string;

  /**
   * The angle by which to rotate the symbol, expressed clockwise in degrees.
   */
  rotation?: number;

  /**
   * The amount by which the symbol is scaled in size.
   */
  scale?: number;

  /**
   * The position of the symbol relative to the marker.
   * The coordinates of the symbol's path are translated left and up by the
   * anchor's x and y coordinates respectively.
   */
  anchor?: PointLiteral;

  /**
   * The symbol's fill color.
   *
   * All CSS3 colors are supported except for extended named colors.
   */
  fillColor?: string;

  /**
   * The symbol's fill opacity.
   */
  fillOpacity?: number;

  /**
   * The symbol's stroke color.
   *
   * All CSS3 colors are supported except for extended named colors.
   */
  strokeColor?: string;

  /**
   * The symbol's stroke opacity.
   */
  strokeOpacity?: number;

  /**
   * The symbol's stroke weight.
   */
  strokeWeight?: number;
}

export function MarkerSymbol({
  path,

  rotation = 0,
  scale = 1,
  fillColor = "black",
  fillOpacity = 0,
  strokeColor = "black",
  strokeOpacity = 1,
  strokeWeight = 1,

  anchor = { x: 0, y: 0 },
}: MarkerSymbolProps) {
  const maps = useGoogleMapsAPI();
  const marker = useGoogleMapMarker();
  const symbol = useDeepCompareMemo(
    () => ({
      path,
      rotation,
      scale,
      fillColor,
      fillOpacity,
      strokeColor,
      strokeOpacity,
      strokeWeight,

      anchor: createPoint(maps, anchor),
    }),
    [
      path,
      scale,
      anchor,
      rotation,
      fillColor,
      fillOpacity,
      strokeColor,
      strokeOpacity,
      strokeWeight,
    ],
  );

  useEffect(
    () => {
      marker.setIcon(symbol);
    },
    [symbol],
  );

  return null;
}

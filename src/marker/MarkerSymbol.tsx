import * as React from "react";

import { GoogleMapContext } from "../google-map-context/GoogleMapContext";
import { isShallowEqual } from "../internal/DataUtils";
import { PointLiteral, createPoint } from "../internal/MapsUtils";
import { MapComponent } from "../map-component/MapComponent";
import { MarkerContextConsumer } from "./MarkerContext";

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

function createSymbol(
  maps: typeof google.maps,
  {
    path,

    rotation = 0,
    scale = 1,
    fillColor = "black",
    fillOpacity = 0,
    strokeColor = "black",
    strokeOpacity = 1,
    strokeWeight = 1,

    anchor = { x: 0, y: 0 },
  }: MarkerSymbolProps,
): google.maps.Symbol {
  return {
    path,
    rotation,
    scale,
    fillColor,
    fillOpacity,
    strokeColor,
    strokeOpacity,
    strokeWeight,

    anchor: createPoint(maps, anchor),
  };
}

export function MarkerSymbol(props: MarkerSymbolProps) {
  return (
    <MarkerContextConsumer>
      {({ marker }) => (
        <MapComponent
          createOptions={({ maps }: GoogleMapContext) =>
            createSymbol(maps, props)
          }
          didMount={({ options }) => {
            marker.setIcon(options);
          }}
          didUpdate={({ options: prevOptions }, { options: nextOptions }) => {
            if (!isShallowEqual(prevOptions, nextOptions)) {
              marker.setIcon(nextOptions);
            }
          }}
        />
      )}
    </MarkerContextConsumer>
  );
}

import * as React from "react";

import { GoogleMapContextConsumer } from "../google-map-context/GoogleMapContext";
import { PointLiteral, createPoint } from "../internal/MapsUtils";
import { isShallowEqualProps } from "../internal/PropsUtils";
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

interface Props extends MarkerSymbolProps {
  maps: typeof google.maps;
  marker: google.maps.Marker;
}

function createSymbol({
  maps,

  path,

  rotation = 0,
  scale = 1,
  fillColor = "black",
  fillOpacity = 0,
  strokeColor = "black",
  strokeOpacity = 1,
  strokeWeight = 1,

  anchor = { x: 0, y: 0 },
}: Props): google.maps.Symbol {
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

class MarkerSymbolElement extends React.Component<Props> {
  public componentDidMount(): void {
    const { marker } = this.props;

    marker.setIcon(createSymbol(this.props));
  }

  public componentDidUpdate(prevProps: Readonly<Props>): void {
    const { marker } = this.props;
    const prevSymbol = createSymbol(prevProps);
    const nextSymbol = createSymbol(this.props);

    if (!isShallowEqualProps(prevSymbol, nextSymbol)) {
      marker.setIcon(nextSymbol);
    }
  }

  public render() {
    return null;
  }
}

export function MarkerSymbol(props: MarkerSymbolProps) {
  return (
    <GoogleMapContextConsumer>
      {({ maps }) => (
        <MarkerContextConsumer>
          {({ marker }) =>
            maps != null &&
            marker != null && (
              <MarkerSymbolElement {...props} maps={maps} marker={marker} />
            )
          }
        </MarkerContextConsumer>
      )}
    </GoogleMapContextConsumer>
  );
}

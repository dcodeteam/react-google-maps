import * as React from "react";

import { GoogleMapContextConsumer } from "../google-map-context/GoogleMapContext";
import {
  PointLiteral,
  SizeLiteral,
  createPoint,
  createSize,
} from "../internal/MapsUtils";
import { isShallowEqualProps } from "../internal/PropsUtils";
import { MarkerContextConsumer } from "./MarkerContext";

export interface MarkerIconProps {
  /**
   * The URL of the image or sprite sheet.
   */
  url: string;

  /**
   * The position at which to anchor an image in correspondence to the location of the marker on the map.
   *
   * By default, the anchor is located along the center point of the bottom of the image.
   */
  anchor?: PointLiteral;

  /**
   * The origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
   *
   * By default, the origin is located in the center point of the image.
   */
  labelOrigin?: PointLiteral;

  /**
   * The position of the image within a sprite, if any.
   */
  origin?: PointLiteral;

  /**
   * The display size of the sprite or image.
   *
   * When using sprites, you must specify the sprite size.
   *
   * If the size is not provided, it will be set when the image loads.
   */
  size?: SizeLiteral;

  /**
   * The size of the entire image after scaling, if any.
   *
   * Use this property to stretch/shrink an image or a sprite.
   */
  scaledSize?: SizeLiteral;
}

interface MarkerIconElementProps extends MarkerIconProps {
  maps: typeof google.maps;
  marker: google.maps.Marker;
}

function createIcon({
  maps,
  url,

  anchor,
  origin,
  labelOrigin,

  size,
  scaledSize,
}: MarkerIconElementProps): google.maps.Icon {
  return {
    url,

    anchor: anchor && createPoint(maps, anchor),
    origin: origin && createPoint(maps, origin),
    labelOrigin: labelOrigin && createPoint(maps, labelOrigin),

    size: size && createSize(maps, size),
    scaledSize: scaledSize && createSize(maps, scaledSize),
  };
}

class MarkerIconElement extends React.Component<MarkerIconElementProps> {
  public componentDidMount(): void {
    const { marker } = this.props;
    const icon = createIcon(this.props);

    marker.setIcon(icon);
  }

  public componentDidUpdate(prevProps: Readonly<MarkerIconElementProps>): void {
    const { marker } = this.props;
    const prevIcon = createIcon(prevProps);
    const nextIcon = createIcon(this.props);

    if (!isShallowEqualProps(prevIcon, nextIcon)) {
      marker.setIcon(nextIcon);
    }
  }

  public render() {
    return null;
  }
}

export function MarkerIcon({
  origin = { x: 0, y: 0 },

  ...props
}: MarkerIconProps) {
  return (
    <GoogleMapContextConsumer>
      {({ map, maps }) => (
        <MarkerContextConsumer>
          {({ marker }) =>
            map != null &&
            maps != null &&
            marker != null && (
              <MarkerIconElement
                {...props}
                maps={maps}
                marker={marker}
                origin={origin}
              />
            )
          }
        </MarkerContextConsumer>
      )}
    </GoogleMapContextConsumer>
  );
}

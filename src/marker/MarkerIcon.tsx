import * as React from "react";

import { GoogleMapContextConsumer } from "../google-map-context/GoogleMapContext";
import { isShallowEqual } from "../internal/DataUtils";
import {
  PointLiteral,
  SizeLiteral,
  createPoint,
  createSize,
} from "../internal/MapsUtils";
import { ValueSpy } from "../internal/ValueSpy";
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

function createIcon(
  maps: typeof google.maps,
  {
    url,

    anchor,
    labelOrigin,

    size,
    scaledSize,

    origin = { x: 0, y: 0 },
  }: MarkerIconProps,
): google.maps.Icon {
  return {
    url,

    anchor: anchor && createPoint(maps, anchor),
    origin: origin && createPoint(maps, origin),
    labelOrigin: labelOrigin && createPoint(maps, labelOrigin),

    size: size && createSize(maps, size),
    scaledSize: scaledSize && createSize(maps, scaledSize),
  };
}

export function MarkerIcon(props: MarkerIconProps) {
  return (
    <GoogleMapContextConsumer>
      {({ maps }) => (
        <MarkerContextConsumer>
          {({ marker }) => {
            if (!maps || !marker) {
              return null;
            }

            const icon = createIcon(maps, props);
            const setIcon = () => {
              marker.setIcon(icon);
            };

            return (
              <ValueSpy
                value={icon}
                didMount={setIcon}
                didUpdate={prevValue => {
                  if (!isShallowEqual(icon, prevValue)) {
                    setIcon();
                  }
                }}
              />
            );
          }}
        </MarkerContextConsumer>
      )}
    </GoogleMapContextConsumer>
  );
}

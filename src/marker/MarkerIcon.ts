import { useEffect } from "react";

import {
  PointLiteral,
  SizeLiteral,
  createPoint,
  createSize,
} from "../internal/MapsUtils";
import { useDeepCompareMemo } from "../internal/useDeepCompareMemo";
import { useGoogleMapMarker, useGoogleMapsAPI } from "../context/GoogleMapsContext";

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

export function MarkerIcon({
  url,

  anchor,
  labelOrigin,

  size,
  scaledSize,

  origin = { x: 0, y: 0 },
}: MarkerIconProps) {
  const maps = useGoogleMapsAPI();
  const marker = useGoogleMapMarker();
  const options = useDeepCompareMemo(
    () => ({
      url,

      anchor: anchor && createPoint(maps, anchor),
      origin: origin && createPoint(maps, origin),
      labelOrigin: labelOrigin && createPoint(maps, labelOrigin),

      size: size && createSize(maps, size),
      scaledSize: scaledSize && createSize(maps, scaledSize),
    }),
    [url, anchor, labelOrigin, size, scaledSize, origin],
  );

  useEffect(
    () => {
      marker.setIcon(options);
    },
    [options],
  );

  return null;
}

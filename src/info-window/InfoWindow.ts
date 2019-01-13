import React, { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

import { SizeLiteral, createLatLng, createSize } from "../internal/MapsUtils";
import { useChangedProps } from "../internal/useChangedProps";
import { useEventHandlers } from "../internal/useEventHandlers";
import { useUpdateEffect } from "../internal/useUpdateEffect";
import { InfoWindowEvent } from "./InfoWindowEvent";
import { useGoogleMap, useGoogleMapsAPI } from "..";

export interface InfoWindowProps {
  /**
   * This handler is called when the close button was clicked.
   */
  onCloseClick?: () => void;

  /**
   * The LatLng at which to display this `InfoWindow`.
   */
  position: google.maps.LatLngLiteral;

  /**
   * Content to display in the `InfoWindow`.
   */
  children: React.ReactNode;

  /**
   * Disable auto-pan on open.
   */
  disableAutoPan?: boolean;

  /**
   * Maximum width of the `InfoWindow`, regardless of content's width.
   */
  maxWidth?: number;

  /**
   * The offset, in pixels, of the tip of the info window from the point
   * on the map at whose geographical coordinates the info window is anchored.
   */
  pixelOffset?: SizeLiteral;

  /**
   * All InfoWindows are displayed on the map in order of their zIndex,
   * with higher values displaying in front of InfoWindows with lower values.
   *
   * By default, InfoWindows are displayed according to their latitude,
   * with InfoWindows of lower latitudes appearing in front of InfoWindows
   * at higher latitudes.
   *
   * InfoWindows are always displayed in front of markers.
   */
  zIndex?: number;
}

export function InfoWindow({
  children,
  position,
  maxWidth,
  zIndex,
  pixelOffset,

  disableAutoPan = false,

  onCloseClick,
}: InfoWindowProps) {
  const map = useGoogleMap();
  const maps = useGoogleMapsAPI();
  const node = useMemo(() => document.createElement("div"), []);
  const options = {
    maxWidth,
    zIndex,
    disableAutoPan,

    position: createLatLng(maps, position),
    content: typeof children === "string" ? children : node,
    pixelOffset: pixelOffset && createSize(maps, pixelOffset),
  };
  const infoWindow = useMemo(() => new maps.InfoWindow(options), []);
  const changedOptions = useChangedProps<google.maps.InfoWindowOptions>(
    options,
  );

  useEffect(() => {
    infoWindow.open(map);

    return () => {
      infoWindow.close();
    };
  }, []);

  useUpdateEffect(
    () => {
      infoWindow.open(map);
    },
    [maxWidth],
  );

  useEffect(
    () => {
      if (changedOptions) {
        infoWindow.setOptions(changedOptions);
      }
    },
    [changedOptions],
  );

  useEventHandlers(infoWindow, InfoWindowEvent, {
    onCloseClick: () => {
      infoWindow.open(map);

      if (onCloseClick) {
        onCloseClick();
      }
    },
  });

  return typeof children === "string" ? null : createPortal(children, node);
}

import React, { useEffect, useMemo, useRef } from "react";

import { createLatLng } from "../internal/MapsUtils";
import { useChangedProps } from "../internal/useChangedProps";
import { useEventHandlers } from "../internal/useEventHandlers";
import { MarkerEvent } from "./MarkerEvent";
import { GoogleMapMarkerContext, useGoogleMap, useGoogleMapsAPI } from "..";

export interface MarkerProps {
  /**
   * Marker position.
   */
  position: google.maps.LatLngLiteral;

  /**
   * Rollover text.
   */
  title?: string;

  /**
   * If `true`, the marker is visible.
   */
  visible?: boolean;

  /**
   * If `true`, the marker receives mouse and touch events.
   */
  clickable?: boolean;

  /**
   * If `true`, the marker can be dragged.
   */
  draggable?: boolean;

  //
  // Style
  //

  /**
   * Which animation to play when marker is added to a map.
   */
  animation?: "BOUNCE" | "DROP";

  /**
   * Mouse cursor to show on hover.
   */
  cursor?: string;

  /**
   * Icon for the foreground.
   */
  icon?: string | React.ReactElement<object>;

  /**
   * Adds a label to the marker.
   *
   * The label can either be a `string`, or a [google.maps.MarkerLabel](https://developers.google.com/maps/documentation/javascript/3.exp/reference#MarkerLabel) object.
   */
  label?: string | google.maps.MarkerLabel;

  /**
   * The marker's opacity between 0.0 and 1.0.
   */
  opacity?: number;

  /**
   * Optimization renders many markers as a single static element.
   *
   * Disable optimized rendering for animated GIFs or PNGs,
   * or when each marker must be rendered as a separate DOM element
   * (advanced usage only).
   */
  optimized?: boolean;

  /**
   * Image map region definition used for drag/click.
   *
   * See also: [google.maps.MarkerShape](https://developers.google.com/maps/documentation/javascript/3.exp/reference#MarkerShape)
   */
  shape?: google.maps.MarkerShape;

  /**
   * All markers are displayed on the map in order of their zIndex,
   * with higher values displaying in front of markers with lower values.
   * By default, markers are displayed according to their vertical position on screen,
   * with lower markers appearing in front of markers further up the screen.
   */
  zIndex?: number;

  /**
   * This handlers is called when the marker icon was clicked.
   */
  onClick?: () => void;
  /**
   * This handlers is called when the marker icon was double clicked.
   */
  onDoubleClick?: () => void;
  /**
   * This handlers is called when the marker icon was clicked.
   */
  onRightClick?: () => void;

  /**
   * This handlers is called for a mouse down on the marker.
   */
  onMouseDown?: () => void;
  /**
   * This handlers is called when the mouse leaves the area of the marker icon.
   */
  onMouseOut?: () => void;
  /**
   * This handlers is called when the mouse enters the area of the marker icon.
   */
  onMouseOver?: () => void;
  /**
   * This handlers is called when for a mouse up on the marker.
   */
  onMouseUp?: () => void;

  /**
   * This handlers is called when the marker icon was clicked.
   */
  onDrag?: () => void;
  /**
   * This handlers is called when the marker icon was clicked.
   */
  onDragStart?: () => void;
  /**
   * This handlers is called when the marker icon was clicked.
   */
  onDragEnd?: () => void;

  /**
   * This handlers is called when the marker `position` property changes.
   */
  onPositionChanged?: () => void;
}

export function Marker({
  position,
  title,
  visible,
  clickable,
  draggable,
  cursor,
  label,
  opacity,
  optimized,
  shape,
  zIndex,

  icon,
  animation,

  onClick,
  onDoubleClick,
  onRightClick,
  onMouseOut,
  onMouseOver,
  onMouseDown,
  onMouseUp,
  onDrag,
  onDragStart,
  onDragEnd,
  onPositionChanged,
}: MarkerProps) {
  const map = useGoogleMap();
  const maps = useGoogleMapsAPI();
  const options: google.maps.MarkerOptions = {
    title,
    visible,
    clickable,
    draggable,
    cursor,
    label,
    opacity,
    optimized,
    shape,
    zIndex,

    position: createLatLng(maps, position),
    animation: animation && maps.Animation[animation],
  };

  if (typeof icon === "string") {
    options.icon = icon;
  }

  const changedOptions = useChangedProps(options);
  const marker = useMemo(() => new maps.Marker(options), []);
  const positionRef = useRef(marker.getPosition());

  useEffect(() => {
    marker.setMap(map);

    return () => {
      marker.setMap(null);
    };
  }, []);

  useEffect(
    () => {
      if (changedOptions) {
        marker.setOptions(changedOptions as google.maps.MarkerOptions);
      }
    },
    [changedOptions],
  );

  useEventHandlers(marker, MarkerEvent, {
    onClick,
    onDoubleClick,
    onRightClick,
    onMouseOut,
    onMouseOver,
    onMouseDown,
    onMouseUp,
    onDrag,
    onDragStart: () => {
      positionRef.current = marker.getPosition();

      if (onDragStart) {
        onDragStart();
      }
    },
    onDragEnd: () => {
      marker.setPosition(positionRef.current);

      if (onDragEnd) {
        onDragEnd();
      }
    },
    onPositionChanged,
  });

  return options.icon ? null : (
    <GoogleMapMarkerContext.Provider value={marker}>
      {icon}
    </GoogleMapMarkerContext.Provider>
  );
}

import { useEffect, useMemo, useRef } from "react";

import { useGoogleMap, useGoogleMapsAPI } from "../context/GoogleMapsContext";
import { createLatLng, createMVCArray } from "../internal/MapsUtils";
import { useChangedProps } from "../internal/useChangedProps";
import { useEventHandlers } from "../internal/useEventHandlers";
import { PolylineEvent } from "./PolylineEvent";

export interface PolylineProps extends PolylineHandlers {
  /**
   * If set to true, the user can drag this shape over the map.
   *
   * The `geodesic` property defines the mode of dragging.
   */
  draggable?: boolean;

  /**
   * Indicates whether this `Polyline` handles mouse events.
   */
  clickable?: boolean;

  /**
   * When `true`, edges of the polygon are interpreted as geodesic and will follow the curvature of the Earth.
   * When `false`, edges of the polygon are rendered as straight lines in screen space.
   *
   * Note that the shape of a geodesic polygon may appear to change when dragged,
   * as the dimensions are maintained relative to the surface of the earth.
   */
  geodesic?: boolean;

  /**
   * Whether this `Polyline` is visible on the map.
   */
  visible?: boolean;

  /**
   * The ordered sequence of coordinates of the `Polyline`.
   */
  path: google.maps.LatLngLiteral[];

  //
  // Style
  //

  /**
   * The stroke color.
   *
   * All CSS3 colors are supported except for extended named colors.
   */
  strokeColor?: string;

  /**
   * The stroke opacity between 0.0 and 1.0.
   */
  strokeOpacity?: number;

  /**
   * The stroke width in pixels.
   */
  strokeWeight?: number;

  /**
   * The zIndex compared to other polys.
   */
  zIndex?: number;
}

interface PolylineHandlers {
  /**
   * This handler is fired when the DOM `click` handlers is fired on the `Polyline`.
   */
  onClick?(): void;

  /**
   * This handler is fired when the DOM `dblclick` handlers is fired on the `Polyline`.
   */
  onDoubleClick?(): void;

  /**
   * This handler is fired when the `Polyline` is right-clicked on.
   */
  onRightClick?(): void;

  /**
   * This handler is fired on `mouseout` handlers is fired on `Polyline`.
   */
  onMouseOut?(): void;

  /**
   * This handler is fired on `mouseover` handlers is fired on `Polyline`.
   */
  onMouseOver?(): void;

  /**
   * This handler is fired when the DOM `mousemove` handlers is fired
   * on `Polyline`.
   */
  onMouseMove?(): void;

  /**
   * This handler is fired when the DOM `mousedown` handlers is fired
   * on `Polyline`.
   */
  onMouseDown?(): void;

  /**
   * This handler is fired when the DOM `mouseup` handlers is fired
   * on `Polyline`.
   */
  onMouseUp?(): void;

  /**
   * This handler is repeatedly fired while the user drags the `Polyline`.
   */
  onDrag?(): void;

  /**
   * This handler is fired when the user starts dragging the `Polyline`.
   */
  onDragStart?(): void;

  /**
   * This handler is fired when the user stops dragging the `Polyline`.
   */
  onDragEnd?(event?: { path: google.maps.LatLng[] }): void;
}

export function Polyline({
  path,
  zIndex,
  strokeColor,
  strokeWeight,
  strokeOpacity,

  visible = true,
  geodesic = false,
  clickable = true,
  draggable = false,

  onClick,
  onDoubleClick,
  onRightClick,
  onMouseOut,
  onMouseOver,
  onMouseMove,
  onMouseDown,
  onMouseUp,
  onDrag,
  onDragStart,
  onDragEnd,
}: PolylineProps) {
  const map = useGoogleMap();
  const maps = useGoogleMapsAPI();
  const options = {
    zIndex,
    visible,
    geodesic,
    clickable,
    draggable,
    strokeColor,
    strokeWeight,
    strokeOpacity,
    path: createMVCArray(maps, path, x => createLatLng(maps, x)),
  };
  const polyline = useMemo(() => new maps.Polyline(options), []);
  const changedOptions = useChangedProps(options);
  const pathRef = useRef(polyline.getPath());

  useEffect(() => {
    polyline.setMap(map);

    return () => {
      polyline.setMap(null);
    };
  }, []);

  useEffect(
    () => {
      if (changedOptions) {
        polyline.setOptions(changedOptions);
      }
    },
    [changedOptions],
  );

  useEventHandlers<PolylineHandlers>(polyline, PolylineEvent, {
    onClick,
    onDoubleClick,
    onRightClick,
    onMouseOut,
    onMouseOver,
    onMouseMove,
    onMouseDown,
    onMouseUp,
    onDrag,
    onDragStart() {
      pathRef.current = polyline.getPath();

      if (onDragStart) {
        onDragStart();
      }
    },
    onDragEnd(event) {
      if (event) {
        Object.assign(event, { path: polyline.getPath().getArray() });
      }

      polyline.setPath(pathRef.current);

      if (onDragEnd) {
        onDragEnd(event);
      }
    },
  });

  return null;
}

import { useEffect, useMemo } from "react";

import { useGoogleMap, useGoogleMapsAPI } from "../context/GoogleMapsContext";
import { useDeepCompareMemo } from "../internal/useDeepCompareMemo";
import { useEventHandlers } from "../internal/useEventHandlers";
import { useUpdateEffect } from "../internal/useUpdateEffect";
import { DrawingControlEvent } from "./DrawingControlEvent";

export interface DrawingControlProps {
  /**
   * Position id. Used to specify the position of the control on the map.
   */
  position?: keyof typeof google.maps.ControlPosition;

  /**
   * The drawing modes to display in the drawing control, in the order in
   * which they are to be displayed.
   *
   * The hand icon (which corresponds to the null drawing mode)
   * is always available and is not to be specified in this array.
   */
  drawingModes?: Array<
    "CIRCLE" | "MARKER" | "POLYGON" | "POLYLINE" | "RECTANGLE"
  >;

  /**
   * This handler is called when the user has finished drawing a `circle`.
   */
  onCircleComplete?: () => void;

  /**
   * This handler is called when the user has finished drawing a `marker`.
   */
  onMarkerComplete?: () => void;

  /**
   * This handler is called when the user has finished drawing an `overlay`
   * of any type.
   */
  onOverlayComplete?: (event: google.maps.drawing.OverlayCompleteEvent) => void;

  /**
   * This handler is called when the user has finished drawing a `polygon`.
   */
  onPolygonComplete?: () => void;

  /**
   * This handler is called when the user has finished drawing a `polyline`.
   */
  onPolylineComplete?: () => void;

  /**
   * This handler is called when the user has finished drawing a `rectangle`.
   */
  onRectangleComplete?: () => void;
}

type Handlers = Pick<
  DrawingControlProps,
  | "onCircleComplete"
  | "onMarkerComplete"
  | "onOverlayComplete"
  | "onPolygonComplete"
  | "onPolylineComplete"
  | "onRectangleComplete"
>;

export function DrawingControl({
  position = "TOP_LEFT",
  drawingModes = ["CIRCLE", "MARKER", "POLYGON", "POLYLINE", "RECTANGLE"],

  onCircleComplete,
  onMarkerComplete,
  onOverlayComplete,
  onPolygonComplete,
  onPolylineComplete,
  onRectangleComplete,
}: DrawingControlProps) {
  const map = useGoogleMap();
  const maps = useGoogleMapsAPI();
  const options = useDeepCompareMemo(
    () => ({
      drawingControl: true,
      drawingControlOptions: {
        position: maps.ControlPosition[position],
        drawingModes: drawingModes.map(x => maps.drawing.OverlayType[x]),
      },
    }),
    [position, drawingModes],
  );
  const manager = useMemo<google.maps.drawing.DrawingManager>(
    () => new maps.drawing.DrawingManager(options),
    [],
  );

  useEffect(() => {
    manager.setMap(map);

    return () => {
      manager.setMap(null);
    };
  }, []);

  useUpdateEffect(
    () => {
      manager.setOptions(options);
    },
    [options],
  );

  useEventHandlers<Handlers>(manager, DrawingControlEvent, {
    onCircleComplete,
    onMarkerComplete,
    onOverlayComplete: event => {
      event.overlay.setMap(null);

      if (onOverlayComplete) {
        onOverlayComplete(event);
      }
    },
    onPolygonComplete,
    onPolylineComplete,
    onRectangleComplete,
  });

  return null;
}

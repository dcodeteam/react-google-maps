import { useEffect, useMemo } from "react";

import { useGoogleMap, useGoogleMapsAPI } from "../context/GoogleMapsContext";
import { useDeepCompareMemo } from "../internal/useDeepCompareMemo";
import { useEventHandlers } from "../internal/useEventHandlers";
import { useMemoOnce } from "../internal/useMemoOnce";
import { DataLayerEvent } from "./DataLayerEvent";

interface DataPolygonHandlerEvent {
  feature: google.maps.Data.Feature;
}

export interface DataPolygonProps {
  /**
   * Array of array of positions.
   */

  geometry: google.maps.LatLngLiteral[][];

  //
  // Style
  //

  /**
   * If true, the marker receives mouse and touch events.
   */
  clickable?: boolean;

  /**
   * The fill color.
   *
   * All CSS3 colors are supported except for extended named colors.
   */
  fillColor?: string;

  /**
   * he fill opacity between 0.0 and 1.0.
   */
  fillOpacity?: number;

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
   * All features are displayed on the map in order of their zIndex,
   * with higher values displaying in front of features with lower values.
   */
  zIndex?: number;

  //
  // Events
  //

  /**
   * This handler is called for a click on the geometry.
   */
  onClick?(event: DataPolygonHandlerEvent): void;

  /**
   * This handler is called for a double click on the geometry.
   */
  onDoubleClick?(event: DataPolygonHandlerEvent): void;

  /**
   * This handler is called for a right click on the geometry.
   */
  onRightClick?(event: DataPolygonHandlerEvent): void;

  /**
   * This handler is called when the mouse leaves the area of the geometry.
   */
  onMouseOut?(event: DataPolygonHandlerEvent): void;

  /**
   * This handler is called when the mouse enters the area of the geometry.
   */
  onMouseOver?(event: DataPolygonHandlerEvent): void;

  /**
   * This handler is called for a mouse down on the geometry.
   */
  onMouseDown?(event: DataPolygonHandlerEvent): void;

  /**
   * This handler is called for a mouse up on the geometry.
   */
  onMouseUp?(event: DataPolygonHandlerEvent): void;
}

type HandlerProps = Pick<
  DataPolygonProps,
  | "onClick"
  | "onDoubleClick"
  | "onRightClick"
  | "onMouseOut"
  | "onMouseOver"
  | "onMouseDown"
  | "onMouseUp"
>;

function enhanceDataPolygonHandler(
  polygon: google.maps.Data.Feature,
  handler?: (event: DataPolygonHandlerEvent) => void,
): (event: DataPolygonHandlerEvent) => void {
  return event => {
    if (handler && event.feature === polygon) {
      handler(event);
    }
  };
}

export function DataPolygon({
  geometry,

  fillColor,
  fillOpacity,
  strokeColor,
  strokeOpacity,
  strokeWeight,
  zIndex,
  clickable = true,

  onClick,
  onDoubleClick,
  onRightClick,
  onMouseOut,
  onMouseOver,
  onMouseDown,
  onMouseUp,
}: DataPolygonProps) {
  const map = useGoogleMap();
  const maps = useGoogleMapsAPI();
  const feature = useMemoOnce(() => new maps.Data.Feature());
  const polygon = useDeepCompareMemo(() => new maps.Data.Polygon(geometry), [
    geometry,
  ]);
  const style = useMemo(
    () => ({
      fillColor,
      fillOpacity,
      strokeColor,
      strokeOpacity,
      strokeWeight,
      zIndex,
      clickable,
    }),
    [
      fillColor,
      fillOpacity,
      strokeColor,
      strokeOpacity,
      strokeWeight,
      zIndex,
      clickable,
    ],
  );

  useEffect(() => {
    map.data.add(feature);

    return () => {
      map.data.remove(feature);
    };
  }, []);

  useEffect(
    () => {
      feature.setGeometry(polygon);
    },
    [polygon],
  );

  useEffect(
    () => {
      map.data.overrideStyle(feature, style);
    },
    [style],
  );

  useEventHandlers<HandlerProps>(map.data, DataLayerEvent, {
    onClick: enhanceDataPolygonHandler(feature, onClick),
    onDoubleClick: enhanceDataPolygonHandler(feature, onDoubleClick),
    onRightClick: enhanceDataPolygonHandler(feature, onRightClick),
    onMouseOut: enhanceDataPolygonHandler(feature, onMouseOut),
    onMouseOver: enhanceDataPolygonHandler(feature, onMouseOver),
    onMouseDown: enhanceDataPolygonHandler(feature, onMouseDown),
    onMouseUp: enhanceDataPolygonHandler(feature, onMouseUp),
  });

  return null;
}

import * as React from "react";

import { isShallowEqual } from "../internal/DataUtils";
import { MapComponent } from "../map-component/MapComponent";
import { MapComponentHandlers } from "../map-component/MapComponentHandlers";
import { MapContext } from "../map/MapContext";
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
  onClick?: (event: DataPolygonHandlerEvent) => void;

  /**
   * This handler is called for a double click on the geometry.
   */
  onDoubleClick?: (event: DataPolygonHandlerEvent) => void;

  /**
   * This handler is called for a right click on the geometry.
   */
  onRightClick?: (event: DataPolygonHandlerEvent) => void;

  /**
   * This handler is called when the mouse leaves the area of the geometry.
   */
  onMouseOut?: (event: DataPolygonHandlerEvent) => void;

  /**
   * This handler is called when the mouse enters the area of the geometry.
   */
  onMouseOver?: (event: DataPolygonHandlerEvent) => void;

  /**
   * This handler is called for a mouse down on the geometry.
   */
  onMouseDown?: (event: DataPolygonHandlerEvent) => void;

  /**
   * This handler is called for a mouse up on the geometry.
   */
  onMouseUp?: (event: DataPolygonHandlerEvent) => void;
}

function createDataPolygonOptions(
  maps: typeof google.maps,
  {
    geometry,

    fillColor,
    fillOpacity,
    strokeColor,
    strokeOpacity,
    strokeWeight,
    zIndex,
    clickable = true,
  }: DataPolygonProps,
): {
  geometry: google.maps.Data.Polygon;
  style: google.maps.Data.StyleOptions;
} {
  return {
    geometry: new maps.Data.Polygon(geometry),
    style: {
      fillColor,
      fillOpacity,
      strokeColor,
      strokeOpacity,
      strokeWeight,
      zIndex,
      clickable,
    },
  };
}

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

function createDataPolygonHandlers(
  polygon: google.maps.Data.Feature,
  {
    onClick,
    onDoubleClick,
    onRightClick,
    onMouseOut,
    onMouseOver,
    onMouseDown,
    onMouseUp,
  }: DataPolygonProps,
) {
  return {
    [DataLayerEvent.onClick]: enhanceDataPolygonHandler(polygon, onClick),
    [DataLayerEvent.onDoubleClick]: enhanceDataPolygonHandler(
      polygon,
      onDoubleClick,
    ),
    [DataLayerEvent.onRightClick]: enhanceDataPolygonHandler(
      polygon,
      onRightClick,
    ),
    [DataLayerEvent.onMouseOut]: enhanceDataPolygonHandler(polygon, onMouseOut),
    [DataLayerEvent.onMouseOver]: enhanceDataPolygonHandler(
      polygon,
      onMouseOver,
    ),
    [DataLayerEvent.onMouseDown]: enhanceDataPolygonHandler(
      polygon,
      onMouseDown,
    ),
    [DataLayerEvent.onMouseUp]: enhanceDataPolygonHandler(polygon, onMouseUp),
  };
}

interface State {
  polygon: google.maps.Data.Feature;
}

export function DataPolygon(props: DataPolygonProps) {
  return (
    <MapComponent
      createOptions={({ maps }: MapContext) =>
        createDataPolygonOptions(maps, props)
      }
      createInitialState={({ maps }: MapContext): State => ({
        polygon: new maps.Data.Feature(),
      })}
      didMount={({ map, state: { polygon }, options: { style, geometry } }) => {
        polygon.setGeometry(geometry);

        map.data.add(polygon);
        map.data.overrideStyle(polygon, style);
      }}
      didUpdate={(
        { options: prevOptions },
        { options: nextOptions, map, state: { polygon } },
      ) => {
        if (!isShallowEqual(prevOptions.style, nextOptions.style)) {
          map.data.overrideStyle(polygon, nextOptions.style);
        }

        if (!isShallowEqual(prevOptions.geometry, nextOptions.geometry)) {
          polygon.setGeometry(nextOptions.geometry);
        }
      }}
      willUnmount={({ map, state: { polygon } }) => {
        map.data.remove(polygon);
      }}
      render={({ map, state: { polygon } }) => (
        <MapComponentHandlers
          instance={map.data}
          handlers={createDataPolygonHandlers(polygon, props)}
        />
      )}
    />
  );
}

import * as React from "react";

import { GoogleMapContext } from "../google-map/GoogleMapContext";
import { createLatLng, createMVCArray } from "../internal/MapsUtils";
import { pickChangedProps } from "../internal/PropsUtils";
import { MapComponent } from "../map-component/MapComponent";
import { MapComponentHandlers } from "../map-component/MapComponentHandlers";
import { PolylineEvent } from "./PolylineEvent";

export interface PolylineProps {
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

  /**
   * This handler is fired when the DOM `click` handlers is fired on the `Polyline`.
   */
  onClick?: () => void;

  /**
   * This handler is fired when the DOM `dblclick` handlers is fired on the `Polyline`.
   */
  onDoubleClick?: () => void;

  /**
   * This handler is fired when the `Polyline` is right-clicked on.
   */
  onRightClick?: () => void;

  /**
   * This handler is fired on `mouseout` handlers is fired on `Polyline`.
   */
  onMouseOut?: () => void;

  /**
   * This handler is fired on `mouseover` handlers is fired on `Polyline`.
   */
  onMouseOver?: () => void;

  /**
   * This handler is fired when the DOM `mousemove` handlers is fired
   * on `Polyline`.
   */
  onMouseMove?: () => void;

  /**
   * This handler is fired when the DOM `mousedown` handlers is fired
   * on `Polyline`.
   */
  onMouseDown?: () => void;

  /**
   * This handler is fired when the DOM `mouseup` handlers is fired
   * on `Polyline`.
   */
  onMouseUp?: () => void;

  /**
   * This handler is repeatedly fired while the user drags the `Polyline`.
   */
  onDrag?: () => void;

  /**
   * This handler is fired when the user starts dragging the `Polyline`.
   */
  onDragStart?: () => void;

  /**
   * This handler is fired when the user stops dragging the `Polyline`.
   */
  onDragEnd?: (event?: { path: google.maps.LatLng[] }) => void;
}

function createPolylineOptions(
  maps: typeof google.maps,
  {
    path,
    zIndex,
    strokeColor,
    strokeWeight,
    strokeOpacity,

    visible = true,
    geodesic = false,
    clickable = true,
    draggable = false,
  }: PolylineProps,
): google.maps.PolylineOptions {
  return {
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
}

function createPolylineHandlers({
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
  return {
    [PolylineEvent.onClick]: onClick,
    [PolylineEvent.onDoubleClick]: onDoubleClick,
    [PolylineEvent.onRightClick]: onRightClick,
    [PolylineEvent.onMouseOut]: onMouseOut,
    [PolylineEvent.onMouseOver]: onMouseOver,
    [PolylineEvent.onMouseMove]: onMouseMove,
    [PolylineEvent.onMouseDown]: onMouseDown,
    [PolylineEvent.onMouseUp]: onMouseUp,
    [PolylineEvent.onDrag]: onDrag,
    [PolylineEvent.onDragStart]: onDragStart,
    [PolylineEvent.onDragEnd]: onDragEnd,
  };
}

interface State {
  polyline: google.maps.Polyline;
}

export function Polyline(props: PolylineProps) {
  return (
    <MapComponent
      createOptions={({ maps }: GoogleMapContext) =>
        createPolylineOptions(maps, props)
      }
      createInitialState={({ maps }: GoogleMapContext): State => ({
        polyline: new maps.Polyline(),
      })}
      didMount={({ map, options, state: { polyline } }) => {
        polyline.setMap(map);
        polyline.setOptions(options);

        let lastPath = polyline.getPath();

        polyline.addListener(PolylineEvent.onDragStart, () => {
          lastPath = polyline.getPath();
        });

        polyline.addListener(PolylineEvent.onDragEnd, e => {
          Object.assign(e, { path: polyline.getPath().getArray() });

          polyline.setPath(lastPath);
        });
      }}
      didUpdate={(
        { options: prevOptions },
        { options: nextOptions, state: { polyline } },
      ) => {
        const options = pickChangedProps(prevOptions, nextOptions);

        if (options) {
          polyline.setOptions(options);
        }
      }}
      willUnmount={({ maps, state: { polyline } }) => {
        polyline.setMap(null);
        maps.event.clearInstanceListeners(polyline);
      }}
      render={({ state: { polyline } }) => (
        <MapComponentHandlers
          instance={polyline}
          handlers={createPolylineHandlers(props)}
        />
      )}
    />
  );
}

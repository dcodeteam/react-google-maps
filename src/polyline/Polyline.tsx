import * as React from "react";

import { GoogleMapComponent } from "../google-map-component/GoogleMapComponent";
import { GoogleMapContext } from "../google-map-context/GoogleMapContext";
import {
  createHandlerProxy,
  forEachEvent,
  pickChangedProps,
} from "../internal/PropsUtils";
import { PolylineEvent } from "./PolylineEvent";

interface EventProps {
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

export interface PolylineProps extends EventProps {
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

function createOptions({
  path,
  zIndex,
  strokeColor,
  strokeWeight,
  strokeOpacity,

  visible = true,
  geodesic = false,
  clickable = true,
  draggable = false,
}: PolylineProps): google.maps.PolylineOptions {
  return {
    path,
    zIndex,
    visible,
    geodesic,
    clickable,
    draggable,
    strokeColor,
    strokeWeight,
    strokeOpacity,
  };
}

interface State {
  polyline: google.maps.Polyline;
}

function createInitialState({ maps }: GoogleMapContext): State {
  return { polyline: new maps.Polyline() };
}

export function Polyline(props: PolylineProps) {
  return (
    <GoogleMapComponent
      options={createOptions(props)}
      createInitialState={createInitialState}
      didMount={({ map, options, state: { polyline } }) => {
        polyline.setOptions(options);
        polyline.setMap(map);

        forEachEvent<EventProps>(PolylineEvent, (key, event) => {
          const handler = createHandlerProxy(() => props[key]);

          if (event === PolylineEvent.onDragEnd) {
            polyline.addListener(event, e => {
              Object.assign(e, { path: polyline.getPath().getArray() });

              polyline.setPath(options.path!);

              handler(e);
            });
          } else {
            polyline.addListener(event, handler);
          }
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
    />
  );
}

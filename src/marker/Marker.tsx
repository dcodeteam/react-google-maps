import * as React from "react";

import { GoogleMapComponent } from "../google-map-component/GoogleMapComponent";
import { GoogleMapContext } from "../google-map-context/GoogleMapContext";
import {
  createHandlerProxy,
  forEachEvent,
  pickChangedProps,
} from "../internal/PropsUtils";
import { MarkerContext, MarkerContextProvider } from "./MarkerContext";
import { MarkerEvent } from "./MarkerEvent";

interface EventProps {
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

export interface MarkerProps extends EventProps {
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
}

function createOptions(
  maps: typeof google.maps,
  {
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
  }: MarkerProps,
): google.maps.MarkerOptions {
  return {
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

    icon: typeof icon === "string" ? icon : undefined,
    animation: animation && maps.Animation[animation],
  };
}

interface State {
  ctx: MarkerContext;
  // eslint-disable-next-line typescript/no-use-before-define
  marker: google.maps.Marker;
}

export class Marker extends React.Component<MarkerProps> {
  public render() {
    const { icon } = this.props;

    return (
      <GoogleMapComponent
        createInitialState={({ maps }: GoogleMapContext): State => {
          const marker = new maps.Marker();

          return { marker, ctx: { marker } };
        }}
        createOptions={({
          maps,
        }: GoogleMapContext): google.maps.MarkerOptions =>
          createOptions(maps, this.props)
        }
        didMount={({ map, options, state: { marker } }) => {
          marker.setMap(map);
          marker.setOptions(options);

          forEachEvent(MarkerEvent, (key, event) => {
            // eslint-disable-next-line react/destructuring-assignment
            const handler = createHandlerProxy(() => this.props[key]);

            if (event === MarkerEvent.onDragEnd) {
              marker.addListener(event, e => {
                marker.setPosition(options.position);

                handler(e);
              });
            } else {
              marker.addListener(event, handler);
            }
          });
        }}
        didUpdate={(
          { options: prevOptions },
          { options: nextOptions, state: { marker } },
        ) => {
          const options = pickChangedProps(prevOptions, nextOptions);

          if (options) {
            marker.setOptions(options as google.maps.MarkerOptions);
          }
        }}
        willUnmount={({ maps, state: { marker } }) => {
          marker.setMap(null);
          maps.event.clearInstanceListeners(marker);
        }}
        render={({ state: { ctx } }) =>
          typeof icon === "string" ? null : (
            <MarkerContextProvider value={ctx}>{icon}</MarkerContextProvider>
          )
        }
      />
    );
  }
}

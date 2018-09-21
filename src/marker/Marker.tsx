import * as React from "react";

import { GoogleMapContextConsumer } from "../google-map-context/GoogleMapContext";
import { createHandlerProxy, pickChangedProps } from "../internal/PropsUtils";
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

interface MarkerElementProps extends MarkerProps {
  map: google.maps.Map;
  maps: typeof google.maps;
}

function createOptions({
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
  animation
}: MarkerElementProps): google.maps.MarkerOptions {
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
    animation: animation && google.maps.Animation[animation]
  };
}

class MarkerElement extends React.Component<MarkerElementProps> {
  private readonly ctx: MarkerContext;

  public constructor(props: MarkerElementProps, context: object) {
    super(props, context);

    const { map, maps } = props;
    const marker = new maps.Marker();

    marker.setMap(map);
    marker.setOptions(createOptions(props));

    this.ctx = { marker };

    const handlerProps = Object.keys(MarkerEvent) as Array<keyof MarkerEvent>;

    // Reset position on drag end.
    marker.addListener(MarkerEvent.onDragEnd, () => {
      const { position } = this.props;

      marker.setPosition(position);
    });

    handlerProps.forEach(prop => {
      const event = MarkerEvent[prop];

      marker.addListener(
        event,
        createHandlerProxy(
          () =>
            // eslint-disable-next-line react/destructuring-assignment
            this.props[prop]
        )
      );
    });
  }

  public componentDidUpdate(prevProps: Readonly<MarkerElementProps>): void {
    const prevOptions = createOptions(prevProps);
    const nextOptions = createOptions(this.props);
    const options = pickChangedProps(prevOptions, nextOptions);

    if (options) {
      this.ctx.marker!.setOptions(options as google.maps.MarkerOptions);
    }
  }

  public componentWillUnmount() {
    const { marker } = this.ctx;
    const { maps } = this.props;

    // Remove marker from map.
    marker!.setMap(null);

    // Remove all listeners from marker.
    maps.event.clearInstanceListeners(marker!);
  }

  public render(): React.ReactNode {
    const { icon } = this.props;

    return !React.isValidElement(icon) ? null : (
      <MarkerContextProvider value={this.ctx}>{icon}</MarkerContextProvider>
    );
  }
}

/**
 * Draws `google.maps.Marker`.
 *
 * **Usage:**
 *
 * ```javascript
 * import React from "react";
 * import { GoogleMap, Marker } from "react-google-map-components"
 *
 * export default function GoogleMapWrapper(props) {
 *   return (
 *     <GoogleMap {...props} maps={google.maps}>
 *       <Marker position={props.center} />
 *     </GoogleMap>
 *   );
 * }
 * ```
 *
 * **Google Maps Docs:**
 * * [google.maps.Marker](https://developers.google.com/maps/documentation/javascript/reference#Marker)
 * * [google.maps.MarkerOptions](https://developers.google.com/maps/documentation/javascript/reference#MarkerOptions)
 */
export function Marker(props: MarkerProps) {
  return (
    <GoogleMapContextConsumer>
      {({ map, maps }) =>
        map != null &&
        maps != null && <MarkerElement map={map} maps={maps} {...props} />
      }
    </GoogleMapContextConsumer>
  );
}

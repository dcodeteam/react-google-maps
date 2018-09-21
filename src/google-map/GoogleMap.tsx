import * as React from "react";

import {
  GoogleMapContext,
  GoogleMapContextProvider
} from "../google-map-context/GoogleMapContext";
import { pickChangedProps } from "../internal/Utils";

const styles = { map: { height: "100%" } };

interface EventProps {
  /**
   * This handler is called when the user clicks on the map.
   *
   * An `MouseEvent` with properties for the clicked location is returned unless a place icon was clicked, in which case an `IconMouseEvent` with a `placeid` is returned.
   */
  onClick?: (
    event: google.maps.MouseEvent | google.maps.IconMouseEvent
  ) => void;

  /**
   * This handler is called when the user double-clicks on the map.
   *
   * Note that the `onClick` handler will be also called,
   * right before this one.
   */
  onDoubleClick?: (
    event: google.maps.MouseEvent | google.maps.IconMouseEvent
  ) => void;

  /**
   * This handler is called when the DOM context menu event is
   * fired on the map container.
   */
  onRightClick?: (
    event: google.maps.MouseEvent | google.maps.IconMouseEvent
  ) => void;

  /**
   * This handler is called whenever the user's mouse moves over
   * the map container.
   */
  onMouseMove?: () => void;

  /**
   * This handler is called when the user's mouse exits the map container.
   */
  onMouseOut?: () => void;

  /**
   * This handler is called when the user's mouse enters the map container.
   */
  onMouseOver?: () => void;

  /**
   * This handler is repeatedly called while the user drags the map.
   */
  onDrag?: () => void;

  /**
   * This handler is called when the user stops dragging the map.
   */
  onDragEnd?: () => void;

  /**
   * This handler is called when the user starts dragging the map.
   */
  onDragStart?: () => void;

  /**
   * This handler is called when the map becomes idle after panning or zooming.
   */
  onIdle?: () => void;

  /**
   * This handler is called when the visible tiles have finished loading.
   */
  onTilesLoaded?: () => void;

  /**
   * This handler is called when the map `tilt` property changes.
   */
  onTiltChanged?: () => void;

  /**
   * This event is fired when the map `zoom` property changes.
   */
  onZoomChanged?: (event?: { zoom: number }) => void;

  /**
   * This handler is called when the viewport bounds have changed.
   */
  onBoundsChanged?: (event?: { bounds: google.maps.LatLngBounds }) => void;

  /**
   * This handler is called when the map `center` property changes.
   */
  onCenterChanged?: () => void;

  /**
   * This handler is called when the map `heading` property changes.
   */
  onHeadingChanged?: () => void;

  /**
   * This handler is called when the `mapTypeId` property changes.
   */
  onMapTypeIdChanged?: () => void;

  /**
   * This handler is called when the `projection` has changed.
   */
  onProjectionChanged?: () => void;
}

export interface GoogleMapProps extends EventProps {
  /**
   * Loaded `google.Maps` instance.
   */
  maps: typeof google.maps;

  /**
   * The initial Map `center`.
   */
  center: google.maps.LatLngLiteral;

  /**
   * The initial Map `zoom` level.
   */
  zoom: number;

  /**
   * The initial Map `mapTypeId`.
   */
  mapTypeId?: "HYBRID" | "ROADMAP" | "SATELLITE" | "TERRAIN";

  /**
   * Google Maps child components.
   */
  children?: React.ReactNode;

  /**
   * When `false`, map icons are not clickable.
   *
   * A map icon represents a point of interest, also known as a POI.
   */
  clickableIcons?: boolean;

  /**
   * Enables/disables `zoom` and `center` on double click.
   */
  disableDoubleClickZoom?: boolean;

  //
  // Styling
  //

  /**
   * Styles of map div.
   */
  style?: React.CSSProperties;

  /**
   * Classes of map div.
   */
  className?: string;

  /**
   * Color used for the background of the Map.
   *
   * This color will be visible when tiles have not yet
   * loaded as the user pans.
   */
  backgroundColor?: string;
}

interface State {
  ctx?: GoogleMapContext;
}

const eventHandlerPairs: Array<[keyof EventProps, string]> = [
  ["onClick", "click"],
  ["onDoubleClick", "dblclick"],
  ["onRightClick", "rightclick"],

  ["onMouseOut", "mouseout"],
  ["onMouseOver", "mouseover"],

  ["onMouseMove", "mousemove"],

  ["onDrag", "drag"],
  ["onDragStart", "dragstart"],
  ["onDragEnd", "dragend"],

  ["onIdle", "idle"],
  ["onTilesLoaded", "tilesloaded"],
  ["onTiltChanged", "tilt_changed"],
  ["onZoomChanged", "zoom_changed"],
  ["onBoundsChanged", "bounds_changed"],
  ["onCenterChanged", "center_changed"],
  ["onHeadingChanged", "heading_changed"],
  ["onMapTypeIdChanged", "maptypeid_changed"],
  ["onProjectionChanged", "projection_changed"]
];

function createMapOptions({
  maps,

  zoom,
  center,
  mapTypeId,
  clickableIcons,
  backgroundColor,
  disableDoubleClickZoom
}: GoogleMapProps): google.maps.MapOptions {
  return {
    zoom,
    center,
    clickableIcons,
    backgroundColor,
    disableDoubleClickZoom,
    mapTypeId: mapTypeId && maps.MapTypeId[mapTypeId]
  };
}

export class GoogleMap extends React.Component<GoogleMapProps, State> {
  public state: State = {};

  private mapRef = React.createRef<HTMLDivElement>();

  private createPropProxy<T>(
    name: keyof EventProps,
    eventModifier?: (event: T) => T
  ) {
    return (event: T) => {
      // eslint-disable-next-line react/destructuring-assignment,typescript/no-explicit-any
      const handler = this.props[name] as any;

      if (handler) {
        handler(!eventModifier ? event : eventModifier(event));
      }
    };
  }

  public componentDidMount() {
    const { maps } = this.props;

    const options = createMapOptions(this.props);
    const googleMap = new maps.Map(this.mapRef.current, {
      ...options,
      disableDefaultUI: true
    });

    eventHandlerPairs.forEach(([prop, event]) => {
      switch (prop) {
        case "onBoundsChanged":
          googleMap.addListener(
            event,
            this.createPropProxy(prop, () => ({
              bounds: googleMap.getBounds()
            }))
          );

          break;

        case "onZoomChanged":
          googleMap.addListener(
            event,
            this.createPropProxy(prop, () => ({
              zoom: googleMap.getZoom()
            }))
          );

          break;

        default:
          googleMap.addListener(event, this.createPropProxy(prop));
      }
    });

    this.setState({ ctx: { maps, map: googleMap } });

    this.forceUpdate();
  }

  public componentDidUpdate(prevProps: Readonly<GoogleMapProps>): void {
    const { ctx } = this.state;

    const prevOptions = createMapOptions(prevProps);
    const nextOptions = createMapOptions(this.props);
    const options = pickChangedProps(prevOptions, nextOptions);

    if (options) {
      ctx!.map!.setValues(options);
    }
  }

  public componentWillUnmount() {
    const { ctx } = this.state;

    ctx!.maps!.event.clearInstanceListeners(this.mapRef.current!);
  }

  public render() {
    const { ctx } = this.state;
    const { style, className, children } = this.props;

    return (
      <div style={style} className={className}>
        <div style={styles.map} ref={this.mapRef} />

        {ctx != null && (
          <GoogleMapContextProvider value={ctx}>
            {children}
          </GoogleMapContextProvider>
        )}
      </div>
    );
  }
}

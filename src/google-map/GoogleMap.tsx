import * as React from "react";

import { MapComponentHandlers } from "../google-map-component/MapComponentHandlers";
import {
  GoogleMapContext,
  GoogleMapContextProvider,
} from "../google-map-context/GoogleMapContext";
import { pickChangedProps } from "../internal/PropsUtils";
import { GoogleMapEvent } from "./GoogleMapEvent";

interface EventProps {
  /**
   * This handler is called when the user clicks on the map.
   *
   * An `MouseEvent` with properties for the clicked location is returned unless a place icon was clicked, in which case an `IconMouseEvent` with a `placeid` is returned.
   */
  onClick?: (
    event: google.maps.MouseEvent | google.maps.IconMouseEvent,
  ) => void;

  /**
   * This handler is called when the user double-clicks on the map.
   *
   * Note that the `onClick` handler will be also called,
   * right before this one.
   */
  onDoubleClick?: (
    event: google.maps.MouseEvent | google.maps.IconMouseEvent,
  ) => void;

  /**
   * This handler is called when the DOM context menu event is
   * fired on the map container.
   */
  onRightClick?: (
    event: google.maps.MouseEvent | google.maps.IconMouseEvent,
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
  onZoomChanged?: (event: { zoom: number }) => void;

  /**
   * This handler is called when the viewport bounds have changed.
   */
  onBoundsChanged?: (
    event: { bounds: null | undefined | google.maps.LatLngBoundsLiteral },
  ) => void;

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

function createOptions({
  maps,

  zoom,
  center,
  backgroundColor,

  mapTypeId = "ROADMAP",
  clickableIcons = true,
  disableDoubleClickZoom = false,
}: GoogleMapProps): google.maps.MapOptions {
  return {
    disableDefaultUI: true,

    zoom,
    center,
    clickableIcons,
    backgroundColor,
    disableDoubleClickZoom,
    mapTypeId: mapTypeId && maps.MapTypeId[mapTypeId],
  };
}

function createHandlers({
  onClick,
  onDoubleClick,
  onRightClick,
  onMouseOut,
  onMouseOver,
  onMouseMove,
  onDrag,
  onDragStart,
  onDragEnd,
  onIdle,
  onTilesLoaded,
  onTiltChanged,
  onCenterChanged,
  onHeadingChanged,
  onMapTypeIdChanged,
  onProjectionChanged,
}: GoogleMapProps) {
  return {
    [GoogleMapEvent.onClick]: onClick,
    [GoogleMapEvent.onDoubleClick]: onDoubleClick,
    [GoogleMapEvent.onRightClick]: onRightClick,
    [GoogleMapEvent.onMouseOut]: onMouseOut,
    [GoogleMapEvent.onMouseOver]: onMouseOver,
    [GoogleMapEvent.onMouseMove]: onMouseMove,
    [GoogleMapEvent.onDrag]: onDrag,
    [GoogleMapEvent.onDragStart]: onDragStart,
    [GoogleMapEvent.onDragEnd]: onDragEnd,
    [GoogleMapEvent.onIdle]: onIdle,
    [GoogleMapEvent.onTilesLoaded]: onTilesLoaded,
    [GoogleMapEvent.onTiltChanged]: onTiltChanged,
    [GoogleMapEvent.onCenterChanged]: onCenterChanged,
    [GoogleMapEvent.onHeadingChanged]: onHeadingChanged,
    [GoogleMapEvent.onMapTypeIdChanged]: onMapTypeIdChanged,
    [GoogleMapEvent.onProjectionChanged]: onProjectionChanged,
  };
}

export class GoogleMap extends React.Component<GoogleMapProps, State> {
  public state: State = {};

  private mapRef = React.createRef<HTMLDivElement>();

  private handleZoomChanged = () => {
    const { ctx } = this.state;
    const { onZoomChanged } = this.props;

    if (onZoomChanged) {
      onZoomChanged({ zoom: ctx!.map.getZoom() });
    }
  };

  private handleBoundsChanged = () => {
    const { ctx } = this.state;
    const { onBoundsChanged } = this.props;

    if (onBoundsChanged) {
      const bounds = ctx!.map.getBounds();

      onBoundsChanged({ bounds: bounds && bounds.toJSON() });
    }
  };

  public componentDidMount() {
    const { maps } = this.props;
    const map = new maps.Map(this.mapRef.current);

    map.setOptions(createOptions(this.props));
    map.addListener(GoogleMapEvent.onZoomChanged, this.handleZoomChanged);
    map.addListener(GoogleMapEvent.onBoundsChanged, this.handleBoundsChanged);

    this.setState({ ctx: { map, maps } });
  }

  public componentDidUpdate(prevProps: Readonly<GoogleMapProps>): void {
    const { ctx } = this.state;

    const prevOptions = createOptions(prevProps);
    const nextOptions = createOptions(this.props);
    const options = pickChangedProps(prevOptions, nextOptions);

    if (options) {
      ctx!.map.setOptions(options);
    }
  }

  public componentWillUnmount() {
    const { ctx } = this.state;
    const {
      maps: { event },
    } = this.props;

    event.clearInstanceListeners(ctx!.map);
    event.clearInstanceListeners(this.mapRef.current!);
  }

  public render() {
    const { ctx } = this.state;
    const { style, className, children } = this.props;

    return (
      <>
        <div style={style} className={className} ref={this.mapRef} />

        {ctx != null && (
          <>
            <GoogleMapContextProvider value={ctx}>
              {children}
            </GoogleMapContextProvider>

            <MapComponentHandlers
              maps={ctx.maps}
              instance={ctx.map}
              handlers={createHandlers(this.props)}
            />
          </>
        )}
      </>
    );
  }
}

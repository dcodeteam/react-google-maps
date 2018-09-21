import * as React from "react";

import {
  GoogleMapContext,
  GoogleMapContextProvider,
} from "../google-map-context/GoogleMapContext";
import {
  createHandlerProxy,
  forEachEvent,
  pickChangedProps,
} from "../internal/PropsUtils";
import { GoogleMapEvent } from "./GoogleMapEvent";

const styles = { map: { height: "100%" } };

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
    event: { bounds: null | undefined | google.maps.LatLngBounds },
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

function createMapOptions({
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

export class GoogleMap extends React.Component<GoogleMapProps, State> {
  public state: State = {};

  private mapRef = React.createRef<HTMLDivElement>();

  public componentDidMount() {
    const { maps } = this.props;
    const map = new maps.Map(this.mapRef.current);

    map.setOptions(createMapOptions(this.props));

    forEachEvent<EventProps>(GoogleMapEvent, (key, event) => {
      /* eslint-disable react/destructuring-assignment */
      if (event === GoogleMapEvent.onBoundsChanged) {
        const handler = createHandlerProxy(() => this.props.onBoundsChanged);

        map.addListener(event, () => {
          handler({ bounds: map.getBounds() });
        });
      } else if (event === GoogleMapEvent.onZoomChanged) {
        const handler = createHandlerProxy(() => this.props.onZoomChanged);

        map.addListener(event, () => {
          handler({ zoom: map.getZoom() });
        });
      } else {
        const handler = createHandlerProxy<any>(() => this.props[key]);

        map.addListener(event, handler);
      }
      /* eslint-enable react/destructuring-assignment */
    });

    this.setState({ ctx: { map, maps } });
  }

  public componentDidUpdate(prevProps: Readonly<GoogleMapProps>): void {
    const { ctx } = this.state;

    const prevOptions = createMapOptions(prevProps);
    const nextOptions = createMapOptions(this.props);
    const options = pickChangedProps(prevOptions, nextOptions);

    if (options) {
      ctx!.map!.setOptions(options);
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

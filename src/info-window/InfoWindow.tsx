import * as React from "react";
import * as ReactDOM from "react-dom";

import { GoogleMapContextConsumer } from "../google-map-context/GoogleMapContext";
import { isShallowEqual } from "../internal/DataUtils";
import { SizeLiteral, createSize } from "../internal/MapsUtils";
import { InfoWindowEvent } from "./InfoWindowEvent";

export interface InfoWindowProps {
  /**
   * 	Controls whether the `InfoWindow` is opened or not.
   */
  open?: boolean;

  /**
   * This handler is called when the close button was clicked.
   */
  onCloseClick?: () => void;

  /**
   * The LatLng at which to display this `InfoWindow`.
   */
  position: google.maps.LatLngLiteral;

  /**
   * Content to display in the `InfoWindow`.
   */
  children: React.ReactNode;

  /**
   * Disable auto-pan on open.
   */
  disableAutoPan?: boolean;

  /**
   * Maximum width of the `InfoWindow`, regardless of content's width.
   */
  maxWidth?: number;

  /**
   * The offset, in pixels, of the tip of the info window from the point
   * on the map at whose geographical coordinates the info window is anchored.
   */
  pixelOffset?: SizeLiteral;

  /**
   * All InfoWindows are displayed on the map in order of their zIndex,
   * with higher values displaying in front of InfoWindows with lower values.
   *
   * By default, InfoWindows are displayed according to their latitude,
   * with InfoWindows of lower latitudes appearing in front of InfoWindows
   * at higher latitudes.
   *
   * InfoWindows are always displayed in front of markers.
   */
  zIndex?: number;
}

interface Props extends InfoWindowProps {
  map: google.maps.Map;
  maps: typeof google.maps;
}

function createOptions(
  maps: typeof google.maps,
  {
    position,
    maxWidth,
    zIndex,
    pixelOffset,

    disableAutoPan = false,
  }: InfoWindowProps,
): google.maps.InfoWindowOptions {
  return {
    position,
    maxWidth,
    zIndex,
    disableAutoPan,

    pixelOffset: pixelOffset && createSize(maps, pixelOffset),
  };
}

class InfoWindowElement extends React.Component<Props> {
  private readonly div: HTMLDivElement;

  private readonly infoWindow: google.maps.InfoWindow;

  public constructor(props: Props, context: object) {
    super(props, context);

    const { maps } = props;

    const infoWindow = new maps.InfoWindow();
    const options = createOptions(maps, props);

    infoWindow.setOptions(options);

    this.infoWindow = infoWindow;
    this.div = document.createElement("div");

    infoWindow.addListener(InfoWindowEvent.onCloseClick, () => {
      const { open, onCloseClick } = this.props;

      // Reopen if it has `open` prop.
      if (open) {
        this.open();
      }

      if (onCloseClick) {
        onCloseClick();
      }
    });
  }

  private open() {
    const { map } = this.props;

    this.infoWindow.open(map);
  }

  private close() {
    this.infoWindow.close();
  }

  private updateContent() {
    const { children } = this.props;

    this.infoWindow.setContent(
      typeof children === "string" ? children : this.div,
    );
  }

  private updateVisibility() {
    const { open } = this.props;

    if (open) {
      this.open();
    } else {
      this.close();
    }
  }

  public componentDidMount(): void {
    this.updateContent();
    this.updateVisibility();
  }

  public componentDidUpdate(prevProps: Readonly<Props>): void {
    const { maps, open, maxWidth, children } = this.props;

    const prevOptions = createOptions(maps, prevProps);
    const nextOptions = createOptions(maps, this.props);

    if (!isShallowEqual(prevOptions, nextOptions)) {
      this.infoWindow.setOptions(nextOptions);
    }

    if (children !== prevProps.children) {
      this.updateContent();
    }

    if (open !== prevProps.open || (open && maxWidth !== prevProps.maxWidth)) {
      this.updateVisibility();
    }
  }

  public componentWillUnmount() {
    const { maps } = this.props;

    this.close();

    maps.event.clearInstanceListeners(this.infoWindow);
  }

  public render() {
    const { open, children } = this.props;

    return !open || typeof children === "string"
      ? null
      : ReactDOM.createPortal(children, this.div);
  }
}

export function InfoWindow({ open = true, ...props }: InfoWindowProps) {
  return (
    <GoogleMapContextConsumer>
      {({ map, maps }) =>
        map != null &&
        maps != null && (
          <InfoWindowElement {...props} open={open} map={map} maps={maps} />
        )
      }
    </GoogleMapContextConsumer>
  );
}

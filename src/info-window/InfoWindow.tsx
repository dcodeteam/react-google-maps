import * as React from "react";
import * as ReactDOM from "react-dom";

import { GoogleMapContext } from "../google-map/GoogleMapContext";
import { SizeLiteral, createSize } from "../internal/MapsUtils";
import { pickChangedProps } from "../internal/PropsUtils";
import { MapComponent } from "../map-component/MapComponent";
import { MapComponentHandlers } from "../map-component/MapComponentHandlers";
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

interface Options extends google.maps.InfoWindowOptions {
  open: boolean;
  children: React.ReactNode;
}

function createInfoWindowOptions(
  maps: typeof google.maps,
  {
    children,
    position,
    maxWidth,
    zIndex,
    pixelOffset,

    open = true,
    disableAutoPan = false,
  }: InfoWindowProps,
): Options {
  return {
    open,
    children,

    position,
    maxWidth,
    zIndex,
    disableAutoPan,

    pixelOffset: pixelOffset && createSize(maps, pixelOffset),
  };
}

interface State {
  div: HTMLDivElement;
  infoWindow: google.maps.InfoWindow;
}

function createInfoWindowHandlers({ onCloseClick }: InfoWindowProps) {
  return {
    [InfoWindowEvent.onCloseClick]: onCloseClick,
  };
}

export function InfoWindow(props: InfoWindowProps) {
  return (
    <MapComponent
      createOptions={({ maps }: GoogleMapContext) =>
        createInfoWindowOptions(maps, props)
      }
      createInitialState={({ maps }: GoogleMapContext): State => ({
        infoWindow: new maps.InfoWindow(),
        div: document.createElement("div"),
      })}
      didMount={({
        map,
        state: { div, infoWindow },
        options: { open, children, ...options },
      }) => {
        infoWindow.setOptions(options);

        if (open) {
          infoWindow.open(map);
        }

        infoWindow.setContent(typeof children === "string" ? children : div);

        infoWindow.addListener(InfoWindowEvent.onCloseClick, () => {
          infoWindow.open(map);
        });
      }}
      didUpdate={(
        { options: { open: prevOpen, children: prevChildren, ...prevOptions } },
        {
          map,
          state: { div, infoWindow },
          options: { open: nextOpen, children: nextChildren, ...nextOptions },
        },
      ) => {
        const options = pickChangedProps(prevOptions, nextOptions);

        if (options) {
          infoWindow.setOptions(options);
        }

        if (prevChildren !== nextChildren) {
          infoWindow.setContent(
            typeof nextChildren === "string" ? nextChildren : div,
          );
        }

        if (
          prevOpen !== nextOpen ||
          (nextOpen && prevOptions.maxWidth !== nextOptions.maxWidth)
        ) {
          if (nextOpen) {
            infoWindow.open(map);
          } else {
            infoWindow.close();
          }
        }
      }}
      willUnmount={({ maps, state: { infoWindow } }) => {
        infoWindow.close();
        maps.event.clearInstanceListeners(infoWindow);
      }}
      render={({ state: { div, infoWindow }, options: { open, children } }) => (
        <>
          {!open || typeof children === "string"
            ? null
            : ReactDOM.createPortal(children, div)}

          <MapComponentHandlers
            instance={infoWindow}
            handlers={createInfoWindowHandlers(props)}
          />
        </>
      )}
    />
  );
}

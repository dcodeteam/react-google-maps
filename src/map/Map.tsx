import React, { ReactElement, useEffect, useRef, useState } from "react";

import {
  GoogleMapContext,
  useGoogleMapsAPI,
} from "../context/GoogleMapsContext";
import { createLatLng } from "../internal/MapsUtils";
import { useChangedProps } from "../internal/useChangedProps";
import { useDeepCompareMemo } from "../internal/useDeepCompareMemo";
import { useEventHandlers } from "../internal/useEventHandlers";
import { MapEvent } from "./MapEvent";

export interface MapProps {
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

  /**
   * This handler is called when the user clicks on the map.
   *
   * An `MouseEvent` with properties for the clicked location is returned unless a place icon was clicked, in which case an `IconMouseEvent` with a `placeid` is returned.
   */
  onClick?(event: google.maps.MouseEvent | google.maps.IconMouseEvent): void;

  /**
   * This handler is called when the user double-clicks on the map.
   *
   * Note that the `onClick` handler will be also called,
   * right before this one.
   */
  onDoubleClick?(
    event: google.maps.MouseEvent | google.maps.IconMouseEvent,
  ): void;

  /**
   * This handler is called when the DOM context menu event is
   * fired on the map container.
   */
  onRightClick?(
    event: google.maps.MouseEvent | google.maps.IconMouseEvent,
  ): void;

  /**
   * This handler is called whenever the user's mouse moves over
   * the map container.
   */
  onMouseMove?(): void;

  /**
   * This handler is called when the user's mouse exits the map container.
   */
  onMouseOut?(): void;

  /**
   * This handler is called when the user's mouse enters the map container.
   */
  onMouseOver?(): void;

  /**
   * This handler is repeatedly called while the user drags the map.
   */
  onDrag?(): void;

  /**
   * This handler is called when the user stops dragging the map.
   */
  onDragEnd?(): void;

  /**
   * This handler is called when the user starts dragging the map.
   */
  onDragStart?(): void;

  /**
   * This handler is called when the map becomes idle after panning or zooming.
   */
  onIdle?(): void;

  /**
   * This handler is called when the visible tiles have finished loading.
   */
  onTilesLoaded?(): void;

  /**
   * This handler is called when the map `tilt` property changes.
   */
  onTiltChanged?(): void;

  /**
   * This event is fired when the map `zoom` property changes.
   */
  onZoomChanged?(event: { zoom: number }): void;

  /**
   * This handler is called when the viewport bounds have changed.
   */
  onBoundsChanged?(event: {
    bounds: null | undefined | google.maps.LatLngBoundsLiteral;
  }): void;

  /**
   * This handler is called when the map `center` property changes.
   */
  onCenterChanged?(): void;

  /**
   * This handler is called when the map `heading` property changes.
   */
  onHeadingChanged?(): void;

  /**
   * This handler is called when the `mapTypeId` property changes.
   */
  onMapTypeIdChanged?(): void;

  /**
   * This handler is called when the `projection` has changed.
   */
  onProjectionChanged?(): void;
}

type Handlers = Pick<
  MapProps,
  | "onClick"
  | "onDoubleClick"
  | "onRightClick"
  | "onMouseOut"
  | "onMouseOver"
  | "onMouseMove"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onIdle"
  | "onTilesLoaded"
  | "onTiltChanged"
  | "onZoomChanged"
  | "onBoundsChanged"
  | "onCenterChanged"
  | "onHeadingChanged"
  | "onMapTypeIdChanged"
  | "onProjectionChanged"
>;

export function Map({
  // Component props
  style,
  children,
  className,

  // Event Handlers
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
  onZoomChanged,
  onBoundsChanged,
  onCenterChanged,
  onHeadingChanged,
  onMapTypeIdChanged,
  onProjectionChanged,

  // Map options.
  zoom,
  center,
  backgroundColor,
  mapTypeId = "ROADMAP",
  clickableIcons = true,
  disableDoubleClickZoom = false,
}: MapProps): ReactElement<object> {
  const maps = useGoogleMapsAPI();
  const node = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [map, setMap] = useState<null | google.maps.Map>(null);
  const mapOptions = useDeepCompareMemo(
    () => ({
      disableDefaultUI: true,

      zoom,
      clickableIcons,
      backgroundColor,
      disableDoubleClickZoom,

      center: createLatLng(maps, center),
      mapTypeId: mapTypeId && maps.MapTypeId[mapTypeId],
    }),
    [
      zoom,
      center,
      mapTypeId,
      clickableIcons,
      backgroundColor,
      disableDoubleClickZoom,
    ],
  );
  const changedOptions = useChangedProps(mapOptions);

  useEffect(() => {
    setMap(new maps.Map(node.current, mapOptions));

    return () => {
      maps.event.clearInstanceListeners(node.current!);
    };
  }, []);

  useEffect(() => {
    if (map && changedOptions) {
      map.setOptions(changedOptions);
    }
  }, [changedOptions]);

  useEventHandlers<Handlers>(
    map,
    MapEvent,
    !mounted
      ? {
          onBoundsChanged() {
            setMounted(true);
          },
        }
      : {
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

          onZoomChanged() {
            if (onZoomChanged) {
              onZoomChanged({ zoom: map!.getZoom() });
            }
          },

          onBoundsChanged() {
            if (onBoundsChanged) {
              const bounds = map!.getBounds();

              onBoundsChanged({ bounds: bounds && bounds.toJSON() });
            }
          },
        },
  );

  return (
    <>
      <div ref={node} style={style} className={className} />

      {map != null && (
        <GoogleMapContext.Provider value={map}>
          {children}
        </GoogleMapContext.Provider>
      )}
    </>
  );
}

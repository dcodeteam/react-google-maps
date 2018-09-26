import * as React from "react";

import { MapControlPosition } from "../controls/internal/MapControl";
import { GoogleMapContext } from "../google-map/GoogleMapContext";
import { isDeepEqual } from "../internal/DataUtils";
import { MapComponent } from "../map-component/MapComponent";
import { MapComponentHandlers } from "../map-component/MapComponentHandlers";
import { DrawingControlEvent } from "./DrawingControlEvent";

export interface DrawingControlProps {
  /**
   * Position id. Used to specify the position of the control on the map.
   */
  position?: MapControlPosition;

  /**
   * The drawing modes to display in the drawing control, in the order in
   * which they are to be displayed.
   *
   * The hand icon (which corresponds to the null drawing mode)
   * is always available and is not to be specified in this array.
   */
  drawingModes?: Array<
    "CIRCLE" | "MARKER" | "POLYGON" | "POLYLINE" | "RECTANGLE"
  >;

  /**
   * This handler is called when the user has finished drawing a `circle`.
   */
  onCircleComplete?: () => void;

  /**
   * This handler is called when the user has finished drawing a `marker`.
   */
  onMarkerComplete?: () => void;

  /**
   * This handler is called when the user has finished drawing an `overlay`
   * of any type.
   */
  onOverlayComplete?: () => void;

  /**
   * This handler is called when the user has finished drawing a `polygon`.
   */
  onPolygonComplete?: () => void;

  /**
   * This handler is called when the user has finished drawing a `polyline`.
   */
  onPolylineComplete?: () => void;

  /**
   * This handler is called when the user has finished drawing a `rectangle`.
   */
  onRectangleComplete?: () => void;
}

function createOptions(
  maps: typeof google.maps,
  {
    position = "TOP_LEFT",
    drawingModes = ["CIRCLE", "MARKER", "POLYGON", "POLYLINE", "RECTANGLE"],
  }: DrawingControlProps,
): google.maps.drawing.DrawingManagerOptions {
  return {
    drawingControl: true,
    drawingControlOptions: {
      position: maps.ControlPosition[position],
      drawingModes: drawingModes.map(x => maps.drawing.OverlayType[x]),
    },
  };
}

interface State {
  manager: google.maps.drawing.DrawingManager;
}

function createHandlers({
  onCircleComplete,
  onMarkerComplete,
  onOverlayComplete,
  onPolygonComplete,
  onPolylineComplete,
  onRectangleComplete,
}: DrawingControlProps) {
  return {
    [DrawingControlEvent.onCircleComplete]: onCircleComplete,
    [DrawingControlEvent.onMarkerComplete]: onMarkerComplete,
    [DrawingControlEvent.onOverlayComplete]: onOverlayComplete,
    [DrawingControlEvent.onPolygonComplete]: onPolygonComplete,
    [DrawingControlEvent.onPolylineComplete]: onPolylineComplete,
    [DrawingControlEvent.onRectangleComplete]: onRectangleComplete,
  };
}

export function DrawingControl(props: DrawingControlProps) {
  return (
    <MapComponent
      createOptions={({ maps }: GoogleMapContext) => createOptions(maps, props)}
      createInitialState={({ maps }: GoogleMapContext): State => ({
        manager: new maps.drawing.DrawingManager(),
      })}
      didMount={({ map, options, state: { manager } }) => {
        manager.setMap(map);
        manager.setOptions(options);

        manager.addListener(DrawingControlEvent.onOverlayComplete, event => {
          event.overlay.setMap(null);
        });
      }}
      didUpdate={(
        { options: prevOptions },
        { options: nextOptions, state: { manager } },
      ) => {
        if (!isDeepEqual(prevOptions, nextOptions)) {
          manager.setOptions(nextOptions);
        }
      }}
      willUnmount={({ maps, state: { manager } }) => {
        manager.setMap(null);
        maps.event.clearInstanceListeners(manager);
      }}
      render={({ state: { manager } }) => (
        <MapComponentHandlers
          instance={manager}
          handlers={createHandlers(props)}
        />
      )}
    />
  );
}

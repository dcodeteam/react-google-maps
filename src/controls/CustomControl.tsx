import * as React from "react";
import * as ReactDOM from "react-dom";

import { MapComponent } from "../map-component/MapComponent";
import { MapContext } from "../map/MapContext";
import { MapControlPosition } from "./internal/MapControl";

export interface CustomControlProps {
  /**
   * Content of control.
   */
  children: React.ReactNode;

  /**
   * Position id. Used to specify the position of the control on the map.
   */
  position: MapControlPosition;
}

interface Options {
  children: React.ReactNode;
  position: google.maps.ControlPosition;
}

function mountControl(
  div: HTMLDivElement,
  map: google.maps.Map,
  position: google.maps.ControlPosition,
) {
  map.controls[position].push(div);
}

function unmountControl(
  div: HTMLDivElement,
  map: google.maps.Map,
  position: google.maps.ControlPosition,
) {
  const controls = map.controls[position];
  const idx = controls.getArray().indexOf(div);

  if (idx !== -1) {
    controls.removeAt(idx);
  }
}

interface State {
  div: HTMLDivElement;
}

export function CustomControl(props: CustomControlProps) {
  return (
    <MapComponent
      createOptions={({ maps }: MapContext): Options => ({
        children: props.children,
        position: maps.ControlPosition[props.position],
      })}
      createInitialState={(): State => ({ div: document.createElement("div") })}
      didMount={({ map, options, state: { div } }) => {
        mountControl(div, map, options.position);
      }}
      didUpdate={(
        { options: prevOptions },
        { options: nextOptions, map, state: { div } },
      ) => {
        if (prevOptions.position !== nextOptions.position) {
          unmountControl(div, map, prevOptions.position);
          mountControl(div, map, nextOptions.position);
        }
      }}
      willUnmount={({ map, options, state: { div } }) => {
        unmountControl(div, map, options.position);
      }}
      render={({ state: { div }, options: { children } }) =>
        ReactDOM.createPortal(children, div)
      }
    />
  );
}

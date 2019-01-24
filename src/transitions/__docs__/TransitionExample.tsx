import React, { ReactNode } from "react";

import { DocsMap } from "../../__docs__/DocsComponents";
import { CustomControl } from "../..";

interface Api<TState> {
  state: TState;
  setState(nextState: Pick<TState, keyof TState>): void;
}

interface Props<TState> {
  zoom: number;
  initialState: TState;

  center: google.maps.LatLngLiteral;
  render(api: Api<TState>): React.ReactNode;
  onAnimateClick(api: Api<TState>): void;
}

function createState<TState>({ initialState }: Props<TState>): TState {
  return initialState;
}

export class TransitionExample<TState> extends React.Component<
  Props<TState>,
  TState
> {
  public state: TState = createState(this.props);

  private updateState = (nextState: Pick<TState, keyof TState>) => {
    this.setState(nextState);
  };

  private createApi(): Api<TState> {
    return { state: this.state, setState: this.updateState };
  }

  public render(): ReactNode {
    const { zoom, center, render, onAnimateClick } = this.props;

    return (
      <DocsMap zoom={zoom} center={center}>
        {render(this.createApi())}

        <CustomControl position="BOTTOM_CENTER">
          <button
            type="button"
            style={{ padding: 10, marginBottom: 10 }}
            onClick={() => onAnimateClick(this.createApi())}
          >
            Animate
          </button>
        </CustomControl>
      </DocsMap>
    );
  }
}

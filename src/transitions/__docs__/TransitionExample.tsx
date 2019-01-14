import React from "react";

import { DocsMap } from "../../__docs__/DocsComponents";
import { CustomControl } from "../..";

interface Api<S> {
  state: S;
  setState(nextState: Pick<S, keyof S>): void;
}

interface Props<S> {
  zoom: number;
  initialState: S;

  center: google.maps.LatLngLiteral;
  render(api: Api<S>): React.ReactNode;
  onAnimateClick(api: Api<S>): void;
}

function createState<S>({ initialState }: Props<S>): S {
  return initialState;
}

export class TransitionExample<S> extends React.Component<Props<S>, S> {
  public state: S = createState(this.props);

  private updateState = (nextState: Pick<S, keyof S>) => {
    this.setState(nextState);
  };

  private createApi(): Api<S> {
    return { state: this.state, setState: this.updateState };
  }

  public render() {
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

import * as React from "react";

import {
  GoogleMapContext,
  GoogleMapContextConsumer,
} from "../google-map-context/GoogleMapContext";

export interface GoogleMapComponentArgs<O, S> extends GoogleMapContext {
  state: S;
  options: O;
  setState: (updater: (state: S) => null | Partial<S>) => void;
}

export interface GoogleMapComponentProps<O, S> {
  options: O;
  createInitialState?: (ctx: GoogleMapContext) => S;

  didMount?: (args: GoogleMapComponentArgs<O, S>) => void;
  didUpdate?: (
    prevArgs: GoogleMapComponentArgs<O, S>,
    nextArgs: GoogleMapComponentArgs<O, S>,
  ) => void;

  willUnmount?: (args: GoogleMapComponentArgs<O, S>) => void;

  render?: (args: GoogleMapComponentArgs<O, S>) => React.ReactNode;
}

interface Props<O, S> extends GoogleMapComponentProps<O, S> {
  ctx: GoogleMapContext;
}

function createState<O, S>({ ctx, createInitialState }: Props<O, S>): S {
  return !createInitialState ? ({} as S) : createInitialState(ctx);
}

class GoogleMapComponentElement<O, S> extends React.Component<Props<O, S>> {
  public state = createState(this.props);

  private updateState = (updater: (state: S) => null | Partial<S>) => {
    this.setState(updater);
  };

  private createArgs(
    { ctx, options }: Props<O, S>,
    state: S,
  ): GoogleMapComponentArgs<O, S> {
    return {
      ...ctx,
      state,
      options,
      setState: this.updateState,
    };
  }

  public componentDidMount(): void {
    const { didMount } = this.props;

    if (didMount) {
      didMount(this.createArgs(this.props, this.state));
    }
  }

  public componentDidUpdate(
    prevProps: Readonly<Props<O, S>>,
    prevState: Readonly<S>,
  ): void {
    const { didUpdate } = this.props;

    if (didUpdate) {
      didUpdate(
        this.createArgs(prevProps, prevState),
        this.createArgs(this.props, this.state),
      );
    }
  }

  public componentWillUnmount(): void {
    const { willUnmount } = this.props;

    if (willUnmount) {
      willUnmount(this.createArgs(this.props, this.state));
    }
  }

  public render() {
    const { render } = this.props;

    return !render ? null : render(this.createArgs(this.props, this.state));
  }
}

export function GoogleMapComponent<P, S>(props: GoogleMapComponentProps<P, S>) {
  return (
    <GoogleMapContextConsumer>
      {ctx => <GoogleMapComponentElement {...props} ctx={ctx} />}
    </GoogleMapContextConsumer>
  );
}

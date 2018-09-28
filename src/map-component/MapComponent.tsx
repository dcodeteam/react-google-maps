import * as React from "react";

import {
  GoogleMapContext,
  GoogleMapContextConsumer,
} from "../google-map/GoogleMapContext";

interface State<O, S> {
  state: S;
  options: O;
}

export type MapComponentArgs<O, S> = GoogleMapContext & State<O, S>;

export interface MapComponentProps<O, S> {
  createOptions: (ctx: GoogleMapContext) => O;
  createInitialState?: (ctx: GoogleMapContext) => S;

  didMount?: (args: MapComponentArgs<O, S>) => void;
  didUpdate?: (
    prevArgs: MapComponentArgs<O, S>,
    nextArgs: MapComponentArgs<O, S>,
  ) => void;

  willUnmount?: (args: MapComponentArgs<O, S>) => void;

  render?: (args: MapComponentArgs<O, S>) => React.ReactNode;
}

interface Props<O, S> extends MapComponentProps<O, S> {
  ctx: GoogleMapContext;
}

function createState<O, S>({
  ctx,
  createOptions,
  createInitialState,
}: Props<O, S>): State<O, S> {
  return {
    options: createOptions(ctx),
    state: !createInitialState ? ({} as S) : createInitialState(ctx),
  };
}

class MapComponentElement<O, S> extends React.Component<
  Props<O, S>,
  State<O, S>
> {
  public static getDerivedStateFromProps<O, S>({
    ctx,
    createOptions,
  }: Props<O, S>): Partial<State<O, S>> {
    return { options: createOptions(ctx) };
  }

  public state = createState(this.props);

  private createArgs(
    { ctx }: Props<O, S>,
    { state, options }: State<O, S>,
  ): MapComponentArgs<O, S> {
    return { ...ctx, state, options };
  }

  public componentDidMount(): void {
    const { didMount } = this.props;

    if (didMount) {
      didMount(this.createArgs(this.props, this.state));
    }
  }

  public componentDidUpdate(
    prevProps: Readonly<Props<O, S>>,
    prevState: Readonly<State<O, S>>,
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

export function MapComponent<P, S>(props: MapComponentProps<P, S>) {
  return (
    <GoogleMapContextConsumer>
      {ctx => <MapComponentElement {...props} ctx={ctx} />}
    </GoogleMapContextConsumer>
  );
}

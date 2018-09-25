import * as React from "react";

import {
  GoogleMapContext,
  GoogleMapContextConsumer,
} from "../google-map-context/GoogleMapContext";

interface State<O, S> {
  state: S;
  options: O;
}

type SetState<S> = (updater: (state: S) => null | S) => void;

export interface GoogleMapComponentArgs<O, S>
  extends State<O, S>,
    GoogleMapContext {
  setState: SetState<S>;
}

export interface GoogleMapComponentProps<O, S> {
  createOptions: (ctx: GoogleMapContext) => O;
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

class GoogleMapComponentElement<O, S> extends React.Component<
  Props<O, S>,
  State<O, S>
> {
  public state = createState(this.props);

  private updateState: SetState<S> = updater => {
    this.setState(({ state }) => {
      const nextState = updater(state);

      return !nextState ? null : { state: nextState };
    });
  };

  private createArgs(
    { ctx }: Props<O, S>,
    { state, options }: State<O, S>,
  ): GoogleMapComponentArgs<O, S> {
    return {
      ...ctx,
      state,
      options,
      setState: this.updateState,
    };
  }

  public componentWillReceiveProps(nextProps: Readonly<Props<O, S>>): void {
    this.setState({ options: nextProps.createOptions(nextProps.ctx) });
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

export function ComponentComponent<P, S>(props: GoogleMapComponentProps<P, S>) {
  return (
    <GoogleMapContextConsumer>
      {ctx => <GoogleMapComponentElement {...props} ctx={ctx} />}
    </GoogleMapContextConsumer>
  );
}

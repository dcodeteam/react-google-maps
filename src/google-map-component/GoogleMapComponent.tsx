import * as React from "react";

import {
  GoogleMapContext,
  GoogleMapContextConsumer,
} from "../google-map-context/GoogleMapContext";

export interface GoogleMapComponentArgs<I, O> {
  ctx: GoogleMapContext;

  options: O;
  instance: I;
}

export interface GoogleMapComponentProps<I, O> {
  // eslint-disable-next-line typescript/no-explicit-any
  handlers: { [key: string]: undefined | ((...args: any[]) => void) };

  createOptions: (ctx: GoogleMapContext) => O;
  createInstance: (ctx: GoogleMapContext) => I;

  didMount?: (args: GoogleMapComponentArgs<I, O>) => void;
  didUpdate?: (
    prevArgs: GoogleMapComponentArgs<I, O>,
    nextArgs: GoogleMapComponentArgs<I, O>,
  ) => void;
  willUnmount?: (args: GoogleMapComponentArgs<I, O>) => void;
  render?: (args: GoogleMapComponentArgs<I, O>) => React.ReactNode;
}

interface Props<I, O> extends GoogleMapComponentProps<I, O> {
  ctx: GoogleMapContext;
}

interface State<O> {
  options: O;
}

function createState<I, O>({ ctx, createOptions }: Props<I, O>): State<O> {
  return { options: createOptions(ctx) };
}

class GoogleMapComponentElement<
  I extends google.maps.MVCObject,
  O
> extends React.Component<Props<I, O>, State<O>> {
  public state = createState(this.props);

  private readonly instance: I;

  public constructor(props: Props<I, O>, context: object) {
    super(props, context);

    const { ctx, createInstance } = props;

    this.instance = createInstance(ctx);
  }

  private createArgs(
    { ctx }: Props<I, O>,
    { options }: State<O>,
  ): GoogleMapComponentArgs<I, O> {
    return { ctx, options, instance: this.instance };
  }

  public componentDidMount(): void {
    const { handlers, didMount } = this.props;

    if (didMount) {
      didMount(this.createArgs(this.props, this.state));
    }

    Object.keys(handlers).forEach(event => {
      this.instance.addListener(event, e => {
        // eslint-disable-next-line react/destructuring-assignment
        const handler = this.props.handlers[event];

        if (handler) {
          handler(e);
        }
      });
    });
  }

  public componentWillReceiveProps(nextProps: Readonly<Props<I, O>>): void {
    this.setState(createState(nextProps));
  }

  public componentDidUpdate(
    prevProps: Readonly<Props<I, O>>,
    prevState: Readonly<State<O>>,
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
    const { ctx, willUnmount } = this.props;

    if (willUnmount) {
      willUnmount(this.createArgs(this.props, this.state));
    }

    ctx.maps.event.clearInstanceListeners(this.instance);
  }

  public render() {
    const { render } = this.props;

    return !render ? null : render(this.createArgs(this.props, this.state));
  }
}

export function GoogleMapComponent<I extends google.maps.MVCObject, O>(
  props: GoogleMapComponentProps<I, O>,
) {
  return (
    <GoogleMapContextConsumer>
      {ctx => <GoogleMapComponentElement {...props} ctx={ctx} />}
    </GoogleMapContextConsumer>
  );
}

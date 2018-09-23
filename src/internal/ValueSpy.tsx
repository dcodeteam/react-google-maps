import * as React from "react";

interface Props<V> {
  value: V;

  didMount?: () => void;
  didUpdate?: (prevValue: V) => void;
}

export class ValueSpy<V> extends React.Component<Props<V>> {
  public componentDidMount(): void {
    const { didMount } = this.props;

    if (didMount) {
      didMount();
    }
  }

  public componentDidUpdate(prevProps: Readonly<Props<V>>): void {
    const { didUpdate } = this.props;

    if (didUpdate) {
      didUpdate(prevProps.value);
    }
  }

  public render() {
    return null;
  }
}

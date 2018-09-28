import * as React from "react";

export interface RegisterEventHandlersProps {
  instance: google.maps.MVCObject;
  // eslint-disable-next-line typescript/no-explicit-any
  handlers: { [key: string]: undefined | ((event: any) => void) };
}

export class MapComponentHandlers extends React.Component<
  RegisterEventHandlersProps
> {
  private listeners: google.maps.MapsEventListener[] = [];

  public componentDidMount(): void {
    const { handlers, instance } = this.props;

    Object.keys(handlers).forEach(event => {
      const listener = instance.addListener(event, e => {
        // eslint-disable-next-line react/destructuring-assignment
        const handler = this.props.handlers[event];

        if (handler) {
          handler(e);
        }
      });

      this.listeners.push(listener);
    });
  }

  public componentWillUnmount(): void {
    this.listeners.forEach(x => {
      x.remove();
    });
  }

  public render() {
    return null;
  }
}

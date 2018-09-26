import * as React from "react";

export interface RegisterEventHandlersProps {
  maps: typeof google.maps;
  instance: google.maps.MVCObject;
  // eslint-disable-next-line typescript/no-explicit-any
  handlers: { [key: string]: undefined | ((event: any) => void) };
}

export class RegisterEventHandlers extends React.Component<
  RegisterEventHandlersProps
> {
  public componentDidMount(): void {
    const { handlers, instance } = this.props;

    Object.keys(handlers).forEach(event => {
      instance.addListener(event, e => {
        try {
          // eslint-disable-next-line react/destructuring-assignment
          const handler = this.props.handlers[event];

          if (handler) {
            handler(e);
          }
        } catch (error) {}
      });
    });
  }

  public componentWillUnmount(): void {
    const { maps, instance } = this.props;

    maps.event.clearInstanceListeners(instance);
  }

  public render() {
    return null;
  }
}

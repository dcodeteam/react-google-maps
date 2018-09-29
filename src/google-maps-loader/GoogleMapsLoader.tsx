import * as React from "react";

import { loadScript } from "../internal/DOMUtils";

// eslint-disable-next-line typescript/no-explicit-any
const win = window as any;
const CALLBACK = "__google_maps_loader_callback__";
const CALLBACK_STACK = "__google_maps_loader_callback_stack__";

interface Props {
  apiKey: string;
  onLoadStart?: () => void;
  onLoadSuccess?: () => void;
  render: (maps: typeof google.maps) => React.ReactNode;
}

interface State {
  loaded: boolean;
}

function loadMaps(key: string, onResolve: () => void): () => void {
  const stack = win[CALLBACK_STACK] || [];

  stack.push(onResolve);

  if (!win[CALLBACK]) {
    win[CALLBACK] = () => {
      while (stack.length > 0) {
        const resolver = stack.pop();

        resolver();
      }
    };
  }

  win[CALLBACK_STACK] = stack;

  loadScript(
    CALLBACK,
    `https://maps.googleapis.com/maps/api/js?libraries=places,drawing,geometry&key=${key}&callback=${CALLBACK}`,
  );

  return () => {
    const idx = stack.indexOf(onResolve);

    if (idx !== -1) {
      stack.splice(idx, 1);
    }
  };
}

export class GoogleMapsLoader extends React.Component<Props, State> {
  public state: State = { loaded: false };

  private unsunbscribe?: () => void;

  public componentDidMount(): void {
    const { apiKey, onLoadStart } = this.props;

    if (onLoadStart) {
      onLoadStart();
    }

    if ("google" in window && google && google.maps) {
      this.setState({ loaded: true });
    } else {
      this.unsunbscribe = loadMaps(apiKey, () => {
        this.setState({ loaded: true });
      });
    }
  }

  public componentDidUpdate(
    _prevProps: Readonly<Props>,
    prevState: Readonly<State>,
  ): void {
    const { loaded } = this.state;
    const { onLoadSuccess } = this.props;

    if (onLoadSuccess && loaded && !prevState.loaded) {
      onLoadSuccess();
    }
  }

  public componentWillUnmount(): void {
    if (this.unsunbscribe) {
      this.unsunbscribe();
    }
  }

  public render() {
    const { loaded } = this.state;
    const { render } = this.props;

    return !loaded ? null : render(google.maps);
  }
}

export function mockMaps(): typeof google.maps {
  const EnumMirror = new Proxy({}, { get: (_, key) => key });

  class Comparable<T> {
    public equals(other: T | this): boolean {
      return this === other;
    }
  }

  class ValueContainer {
    public values: Record<string, unknown> = {};

    public constructor(values: Record<string, unknown> = {}) {
      this.values = values;

      Object.defineProperties(this, {
        get: { enumerable: false, value: jest.fn(this.get.bind(this)) },
        set: { enumerable: false, value: jest.fn(this.set.bind(this)) },
        setValues: {
          enumerable: false,
          value: jest.fn(this.setValues.bind(this)),
        },
      });
    }

    public get(key: string) {
      return this.values[key];
    }

    public set(key: string, value: unknown) {
      this.values[key] = value;
    }

    public setValues(nextValues: Record<string, unknown>) {
      Object.assign(this.values, nextValues);
    }
  }

  class MVCObject extends ValueContainer {
    public listeners = new Proxy<
      Record<string, Array<{ fn(...args: unknown[]): void; remove(): void }>>
    >(
      {},
      {
        get: (acc, key: string) => {
          if (!acc[key]) {
            acc[key] = [];
          }

          return acc[key];
        },
      },
    );

    public constructor(values?: Record<string, unknown>) {
      super(values);

      Object.defineProperties(this, {
        emit: {
          enumerable: false,
          value: jest.fn((event, ...args) => {
            const listeners = this.listeners[event];

            if (listeners) {
              listeners.forEach(({ fn }) => {
                fn(...args);
              });
            }
          }),
        },

        addListener: {
          enumerable: false,
          value: jest.fn((event, fn) => {
            const listeners = this.listeners[event];

            const listener = {
              fn,
              remove: jest.fn(() => {
                const idx = listeners.indexOf(listener);

                if (idx !== -1) {
                  listeners.splice(idx, 1);
                }
              }),
            };

            listeners.push(listener);

            this.listeners[event] = listeners;

            return listener;
          }),
        },
      });
    }
  }

  class MVCArray<T> {
    public values: T[] = [];

    public constructor(values?: unknown) {
      if (values && (values as T[]).forEach) {
        (values as T[]).forEach(x => this.values.push(x));
      }

      Object.defineProperties(this, {
        push: { enumerable: false, value: jest.fn(x => this.values.push(x)) },
        getArray: { enumerable: false, value: jest.fn(() => this.values) },
        removeAt: {
          enumerable: false,
          value: jest.fn(index => this.values.splice(index, 1)),
        },
        clear: {
          enumerable: false,
          value: jest.fn(() => this.values.splice(0, this.values.length)),
        },
      });
    }
  }

  class GoogleMap extends MVCObject {
    public controls = new Proxy<Record<string, MVCArray<unknown>>>(
      {},
      {
        // eslint-disable-next-line no-return-assign
        get: (ctx, key: string) => ctx[key] || (ctx[key] = new MVCArray()),
      },
    );

    public data = Object.defineProperties(new MVCObject(), {
      add: { enumerable: false, value: jest.fn() },
      remove: { enumerable: false, value: jest.fn() },
      overrideStyle: { enumerable: false, value: jest.fn() },
    });

    public constructor(node: Node, options: google.maps.MapOptions) {
      super({
        ...options,
        node,
        bounds: { east: 0, north: 0, south: 0, west: 0 },
      });

      Object.defineProperties(this, {
        getZoom: { enumerable: false, value: jest.fn(() => this.get("zoom")) },
        getBounds: {
          enumerable: false,
          value: jest.fn(() => ({ toJSON: () => this.get("bounds") })),
        },

        fitBounds: { enumerable: false, value: jest.fn() },
        panBy: { enumerable: false, value: jest.fn() },
        panTo: { enumerable: false, value: jest.fn() },
        panToBounds: { enumerable: false, value: jest.fn() },

        setOptions: {
          configurable: false,
          value: jest.fn(this.setValues.bind(this)),
        },
      });
    }
  }

  class Marker extends MVCObject {
    public constructor(values: Record<string, unknown>) {
      super(values);

      Object.defineProperties(this, {
        setOptions: {
          enumerable: false,
          value: jest.fn(this.setValues.bind(this)),
        },
        setMap: {
          enumerable: false,
          value: jest.fn(map => this.set("map", map)),
        },
        setIcon: {
          enumerable: false,
          value: jest.fn(icon => this.set("icon", icon)),
        },
        getPosition: {
          enumerable: false,
          value: jest.fn(() => this.get("position")),
        },
        setPosition: {
          enumerable: false,
          value: jest.fn(position => this.set("position", position)),
        },
      });
    }
  }

  class InfoWindow extends MVCObject {
    public constructor(values: Record<string, unknown>) {
      super(values);

      Object.defineProperties(this, {
        open: { enumerable: false, value: jest.fn() },
        close: { enumerable: false, value: jest.fn() },
        setOptions: {
          enumerable: false,
          value: jest.fn(this.setValues.bind(this)),
        },
        getContent: {
          enumerable: false,
          value: jest.fn(() => this.get("content")),
        },
      });
    }
  }

  class Polyline extends MVCObject {
    public constructor(values: Record<string, unknown>) {
      super(values);

      Object.defineProperties(this, {
        setOptions: {
          enumerable: false,
          value: jest.fn(this.setValues.bind(this)),
        },
        setMap: { enumerable: false, value: jest.fn() },

        getPath: { enumerable: false, value: jest.fn(() => this.get("path")) },
        setPath: {
          enumerable: false,
          value: jest.fn(path => this.set("path", new MVCArray(path))),
        },
      });
    }
  }

  class DrawingManager extends MVCObject {
    public constructor(values: Record<string, unknown>) {
      super(values);

      Object.defineProperties(this, {
        setOptions: {
          enumerable: false,
          value: jest.fn(this.setValues.bind(this)),
        },
        setMap: {
          enumerable: false,
          value: jest.fn(map => this.set("map", map)),
        },
      });
    }
  }

  class DataPolygon extends ValueContainer {
    public constructor(values: unknown[]) {
      super({ array: values });

      Object.defineProperties(this, {
        getArray: {
          enumerable: false,
          value: jest.fn(() => this.get("array")),
        },
      });
    }
  }

  class DataFeature extends ValueContainer {
    public constructor(values: Record<string, unknown>) {
      super(values);

      Object.defineProperties(this, {
        getGeometry: {
          enumerable: false,
          value: jest.fn(() => this.get("geometry")),
        },

        setGeometry: {
          enumerable: false,
          value: jest.fn(geometry => this.set("geometry", geometry)),
        },
      });
    }
  }

  class PlacesAutocomplete extends MVCObject {
    public constructor(input: unknown, values: Record<string, unknown>) {
      super({ ...values, input });

      Object.defineProperties(this, {
        getPlace: {
          enumerable: false,
          value: jest.fn(() => this.get("place")),
        },
      });
    }
  }

  class LatLng extends Comparable<LatLng> {
    public latitude: number;

    public longitude: number;

    public constructor(latitude: number, longitude: number) {
      super();
      this.latitude = latitude;
      this.longitude = longitude;
    }

    public lat() {
      return this.latitude;
    }

    public lng() {
      return this.longitude;
    }

    public equals(other: this | LatLng): boolean {
      return this.lat() === other.lat() && this.lng() === other.lng();
    }
  }

  class LatLngBounds extends Comparable<LatLngBounds> {
    public south: number;

    public west: number;

    public north: number;

    public east: number;

    public constructor(
      sw?: google.maps.LatLngLiteral,
      ne?: google.maps.LatLngLiteral,
    ) {
      super();

      this.south = sw ? sw.lat : 0;
      this.west = sw ? sw.lng : 0;

      this.north = ne ? ne.lat : 0;
      this.east = ne ? ne.lng : 0;

      Object.defineProperties(this, {
        extend: {
          writable: false,
          enumerable: false,
          value: jest.fn(({ lat, lng }) => {
            this.south = Math.min(this.south, lat);
            this.west = Math.min(this.west, lng);
            this.north = Math.max(this.north, lat);
            this.east = Math.max(this.east, lng);

            return this;
          }),
        },
      });
    }

    public equals(other: this | LatLngBounds): boolean {
      return (
        this.south === other.south &&
        this.west === other.west &&
        this.north === other.north &&
        this.east === other.east
      );
    }
  }

  class Size extends Comparable<Size> {
    public width: number;

    public height: number;

    public constructor(width: number, height: number) {
      super();
      this.height = height;
      this.width = width;
    }

    public equals(other: this | Size): boolean {
      return this.width === other.width && this.height === other.height;
    }
  }

  class Point extends Comparable<Point> {
    public x: number;

    public y: number;

    public constructor(x: number, y: number) {
      super();
      this.y = y;
      this.x = x;
    }

    public equals(other: this | Point): boolean {
      return this.x === other.x && this.y === other.y;
    }
  }

  /* eslint-disable typescript/no-explicit-any */
  return {
    Animation: EnumMirror,
    MapTypeId: EnumMirror,
    ControlPosition: EnumMirror,
    MapTypeControlStyle: EnumMirror,

    event: {
      addListenerOnce: jest.fn((instance, event, fn) => {
        const listener = instance.addListener(event, () => {
          listener.remove();

          fn();
        });

        return listener;
      }),

      clearInstanceListeners: jest.fn(instance => {
        if (instance.listeners) {
          Object.keys(instance.listeners).forEach(event => {
            const listeners = instance.listeners[event];

            while (listeners.length > 0) {
              listeners[0].remove();
            }
          });
        }
      }),

      trigger: jest.fn((instance, event, ...args) => {
        if (instance.listeners) {
          const listeners = instance.listeners[event];

          listeners.forEach((x: { fn(...args: unknown[]): void }) => {
            x.fn(...args);
          });
        }
      }),
    },

    LatLng,
    LatLngBounds,

    Size,

    Point,

    MVCArray: jest
      .fn(MVCArray as any)
      .mockImplementation(values => new MVCArray(values)),

    Map: jest
      .fn(GoogleMap as any)
      .mockImplementation((node, options) => new GoogleMap(node, options)),

    Marker: jest
      .fn(Marker as any)
      .mockImplementation(options => new Marker(options)),

    InfoWindow: jest
      .fn(InfoWindow as any)
      .mockImplementation(options => new InfoWindow(options)),

    Polyline: jest
      .fn(Polyline as any)
      .mockImplementation(options => new Polyline(options)),

    places: {
      Autocomplete: jest
        .fn(PlacesAutocomplete as any)
        .mockImplementation(
          (input, options) => new PlacesAutocomplete(input, options),
        ),
    },

    drawing: {
      OverlayType: EnumMirror,

      DrawingManager: jest
        .fn(DrawingManager as any)
        .mockImplementation(options => new DrawingManager(options)),
    },

    Data: {
      Polygon: jest
        .fn(DataPolygon as any)
        .mockImplementation(options => new DataPolygon(options)),

      Feature: jest
        .fn(DataFeature as any)
        .mockImplementation(options => new DataFeature(options)),
    },
  } as any;
  /* eslint-enable typescript/no-explicit-any */
}

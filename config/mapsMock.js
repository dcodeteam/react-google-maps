"use strict";

const EnumMirror = new Proxy({}, { get: (x, key) => key });

class Comparable {
  equals(other) {
    return this === other;
  }
}

class ValueContainer {
  constructor(values) {
    this.values = { ...values };

    this.get = jest.fn(key => this.values[key]);
    this.set = jest.fn((key, value) => {
      this.values[key] = value;
    });

    this.setValues = jest.fn(nextValues => {
      this.values = { ...this.values, ...nextValues };
    });
  }
}

class MVCObject extends ValueContainer {
  constructor(values) {
    super(values);

    this.listeners = {};

    this.emit = jest.fn((event, ...args) => {
      const listeners = this.listeners[event];

      if (listeners) {
        listeners.forEach(({ fn }) => {
          fn(...args);
        });
      }
    });

    this.addListener = jest.fn((event, fn) => {
      const listeners = this.listeners[event] || [];
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
    });
  }
}

class GoogleMap extends MVCObject {
  constructor(node, options) {
    super({ ...options, bounds: { east: 0, north: 0, south: 0, west: 0 } });

    this.node = node;

    this.controls = new Proxy(
      {},
      {
        get: (ctx, key) => {
          if (!ctx[key]) {
            const items = [];

            ctx[key] = {
              push: jest.fn((...args) => {
                items.push(...args);
              }),
              removeAt: jest.fn(index => {
                items.splice(index, 1);
              }),
              getArray: jest.fn(() => items),
              clear: jest.fn(() => {
                items.splice(0, items.length);
              }),
            };
          }

          return ctx[key];
        },
      },
    );

    this.setOptions = this.setValues;
    this.getZoom = jest.fn(() => this.get("zoom"));
    this.getBounds = jest.fn(() => ({ toJSON: () => this.get("bounds") }));

    this.fitBounds = jest.fn();
    this.panBy = jest.fn();
    this.panTo = jest.fn();
    this.panToBounds = jest.fn();

    this.data = {
      ...new MVCObject(),

      add: jest.fn(),
      remove: jest.fn(),
      overrideStyle: jest.fn(),
    };
  }
}

class Marker extends MVCObject {
  constructor(values) {
    super(values);

    this.setOptions = this.setValues;
    this.setMap = jest.fn(map => this.set("map", map));
    this.setIcon = jest.fn(icon => this.set("icon", icon));

    this.getPosition = jest.fn(() => this.get("position"));
    this.setPosition = jest.fn(position => this.set("position", position));
  }
}

class InfoWindow extends MVCObject {
  constructor(values) {
    super(values);
    this.open = jest.fn();
    this.close = jest.fn();
    this.setContent = jest.fn();
    this.setOptions = jest.fn();
  }
}

class Polyline extends MVCObject {
  constructor(values) {
    super(values);

    this.setOptions = this.setValues;
    this.setMap = jest.fn();

    this.setPath = jest.fn(path => this.set("path", path));
    this.getPath = jest.fn(() => ({ getArray: () => this.get("path") }));
  }
}

class DrawingManager extends MVCObject {
  constructor(values) {
    super(values);

    this.setOptions = this.setValues;
    this.setMap = jest.fn(map => this.set("map", map));
  }
}

class DataPolygon extends ValueContainer {
  constructor(values) {
    super({ array: values });

    this.getArray = jest.fn(() => this.get("array"));
  }
}

class DataFeature extends ValueContainer {
  constructor(values) {
    super(values);

    this.getGeometry = jest.fn(() => this.get("geometry"));
    this.setGeometry = jest.fn(geometry => this.set("geometry", geometry));
  }
}

module.exports = {
  Animation: EnumMirror,
  MapTypeId: EnumMirror,
  ControlPosition: EnumMirror,
  MapTypeControlStyle: EnumMirror,

  event: {
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
  },

  Size: class extends Comparable {
    constructor(width, height) {
      super();

      this.width = width;
      this.height = height;
    }

    equals(other) {
      return this.width === other.width && this.height === other.height;
    }
  },

  Point: class extends Comparable {
    constructor(x, y) {
      super();

      this.x = x;
      this.y = y;
    }

    equals(other) {
      return this.x === other.x && this.y === other.y;
    }
  },

  Map: jest
    .fn(GoogleMap)
    .mockImplementation((node, options) => new GoogleMap(node, options)),

  Marker: jest.fn(Marker).mockImplementation(options => new Marker(options)),

  InfoWindow: jest
    .fn(InfoWindow)
    .mockImplementation(options => new InfoWindow(options)),

  Polyline: jest
    .fn(Polyline)
    .mockImplementation(options => new Polyline(options)),

  drawing: {
    OverlayType: EnumMirror,

    DrawingManager: jest
      .fn(DrawingManager)
      .mockImplementation(options => new DrawingManager(options)),
  },

  Data: {
    Polygon: jest
      .fn(DataPolygon)
      .mockImplementation(options => new DataPolygon(options)),

    Feature: jest
      .fn(DataFeature)
      .mockImplementation(options => new DataFeature(options)),
  },

  // LatLng: function GoogleMapsLatLng(latLng) {
  //   this.lat = latLng.lat;
  //   this.lng = latLng.lng;
  // },

  // LatLngBounds: function GoogleMapsLatLngBounds() {
  //   this.extends = [];
  //
  //   this.extend = jest.fn(latLng => {
  //     this.extends.push(latLng);
  //
  //     return this;
  //   });
  // },
};

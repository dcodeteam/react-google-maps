"use strict";

const enzyme = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");

enzyme.configure({ adapter: new Adapter() });

// const controlTypes = [
//   "BOTTOM_CENTER",
//   "BOTTOM_LEFT",
//   "BOTTOM_RIGHT",
//   "LEFT_BOTTOM",
//   "LEFT_CENTER",
//   "LEFT_TOP",
//   "RIGHT_BOTTOM",
//   "RIGHT_CENTER",
//   "RIGHT_TOP",
//   "TOP_CENTER",
//   "TOP_LEFT",
//   "TOP_RIGHT"
// ];

class MVCObject {
  constructor(options) {
    this.options = { ...options, bounds: [] };
    this.listeners = {};
  }

  get(key) {
    return this.options[key];
  }

  set(key, value) {
    this.options[key] = value;
  }

  setValues(options) {
    this.options = { ...this.options, ...options };
  }

  emit(event, ...args) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(listener => {
        listener(...args);
      });
    }
  }

  addListener(event, listener) {
    this.listeners[event] = this.listeners[event] || [];

    this.listeners[event].push(listener);
  }
}

global.google = {
  maps: {
    MapTypeId: {
      HYBRID: "HYBRID",
      ROADMAP: "ROADMAP",
      SATELLITE: "SATELLITE",
      TERRAIN: "TERRAIN"
    },

    event: {
      clearInstanceListeners() {}
    },

    Map: class extends MVCObject {
      constructor(node, options) {
        super(options);

        this.node = node;
      }

      getZoom() {
        return this.get("zoom");
      }

      getBounds() {
        return this.get("bounds");
      }

      // this.setValues = noop;
      //
      // this.getBounds = noop;
      //
      // this.getZoom = noop;
      //
      //
      //
      // this.emit = (event, x) => {
      //   const eventListeners = this.listeners[event];
      //
      //   if (eventListeners) {
      //     eventListeners.forEach(fn => {
      //       fn(x);
      //     });
      //   }
      // };
      //
      // this.addListener = (event, listener) => {
      //   this.listeners[event] = this.listeners[event] || [];
      //   this.listeners[event].push(listener);
      // };
      //
      // this.fitBounds = noop;
      // this.panBy = noop;
      // this.panTo = noop;
      // this.panToBounds = noop;
      //
      // this.controls = controlTypes.reduce((acc, control) => {
      //   const items = [];
      //
      //   acc[control] = {
      //     items,
      //     push: jest.fn((...args) => {
      //       items.push(...args);
      //     }),
      //     indexOf: jest.fn(x => items.indexOf(x)),
      //     removeAt: jest.fn(index => {
      //       items.splice(index, 1);
      //     })
      //   };
      //
      //   return acc;
      // }, {});
      //
      // this.data = {
      //   items: [],
      //   add(item) {
      //     this.items.push(item);
      //   },
      //
      //   remove(item) {
      //     const index = this.items.indexOf(item);
      //
      //     if (index !== -1) {
      //       this.items.splice(index, 1);
      //     }
      //   },
      //
      //   overrideStyle: noop,
      //
      //   listeners: {},
      //
      //   emit(event, x) {
      //     const events = this.listeners[event];
      //
      //     if (event) {
      //       events.forEach(fn => {
      //         fn(x);
      //       });
      //     }
      //   },
      //
      //   addListener(event, fn) {
      //     this.listeners[event] = this.listeners[event] || [];
      //
      //     this.listeners[event].push(fn);
      //
      //     return {
      //       remove: () => {
      //         const index = this.listeners[event].indexOf(fn);
      //
      //         if (index !== -1) {
      //           this.listeners[event].splice(index, 1);
      //         }
      //       }
      //     };
      //   }
      // };
    }

    // Size: function GoogleMapsSize(width, height) {
    //   this.width = width;
    //   this.height = height;
    // },
    //
    // Point: function GoogleMapsPoint(x, y) {
    //   this.x = x;
    //   this.y = y;
    // },
    //
    // LatLng: function GoogleMapsLatLng(latLng) {
    //   this.lat = latLng.lat;
    //   this.lng = latLng.lng;
    // },
    //
    // LatLngBounds: function GoogleMapsLatLngBounds() {
    //   this.extends = [];
    //
    //   this.extend = jest.fn(latLng => {
    //     this.extends.push(latLng);
    //
    //     return this;
    //   });
    // },
    //
    // InfoWindow: function GoogleMapsInfoWindow() {
    //   this.open = noop;
    //   this.close = noop;
    //
    //   this.setValues = noop;
    //   this.setContent = noop;
    //
    //   this.listeners = {};
    //
    //   this.emit = (event, x) => {
    //     const fns = this.listeners[event];
    //
    //     if (fns) {
    //       fns.forEach(fn => {
    //         fn(x);
    //       });
    //     }
    //   };
    //
    //   this.addListener = jest.fn((event, fn) => {
    //     this.listeners[event] = this.listeners[event] || [];
    //
    //     this.listeners[event].push(fn);
    //   });
    // },
    //
    // Polyline: function GoogleMapsPolyline() {
    //   this.setMap = noop;
    //   this.setValues = noop;
    //
    //   this.path = null;
    //
    //   this.getPath = jest.fn(() => this.path);
    //   this.setPath = jest.fn(path => {
    //     this.path = path;
    //   });
    //
    //   this.listeners = {};
    //
    //   this.emit = (event, x) => {
    //     const fns = this.listeners[event];
    //
    //     if (fns) {
    //       fns.forEach(fn => {
    //         fn(x);
    //       });
    //     }
    //   };
    //
    //   this.addListener = jest.fn((event, fn) => {
    //     this.listeners[event] = this.listeners[event] || [];
    //
    //     this.listeners[event].push(fn);
    //   });
    // },
    //
    // Marker: function GoogleMapsPolyline() {
    //   this.setMap = noop;
    //   this.setIcon = noop;
    //   this.setValues = noop;
    //   this.setPosition = noop;
    //
    //   this.listeners = {};
    //
    //   this.emit = (event, x) => {
    //     const fns = this.listeners[event];
    //
    //     if (fns) {
    //       fns.forEach(fn => {
    //         fn(x);
    //       });
    //     }
    //   };
    //
    //   this.addListener = jest.fn((event, fn) => {
    //     this.listeners[event] = this.listeners[event] || [];
    //
    //     this.listeners[event].push(fn);
    //   });
    // },
    //

    //
    // ControlPosition: {
    //   BOTTOM_CENTER: "BOTTOM_CENTER",
    //   BOTTOM_LEFT: "BOTTOM_LEFT",
    //   BOTTOM_RIGHT: "BOTTOM_RIGHT",
    //   LEFT_BOTTOM: "LEFT_BOTTOM",
    //   LEFT_CENTER: "LEFT_CENTER",
    //   LEFT_TOP: "LEFT_TOP",
    //   RIGHT_BOTTOM: "RIGHT_BOTTOM",
    //   RIGHT_CENTER: "RIGHT_CENTER",
    //   RIGHT_TOP: "RIGHT_TOP",
    //   TOP_CENTER: "TOP_CENTER",
    //   TOP_LEFT: "TOP_LEFT",
    //   TOP_RIGHT: "TOP_RIGHT"
    // },
    //
    // Data: {
    //   Polygon: noop,
    //
    //   Feature: function GoogleMapsDataFeature() {
    //     this.setGeometry = noop;
    //   }
    // },
    //
    // drawing: {
    //   DrawingManager: class {
    //     constructor() {
    //       this.map = null;
    //       this.values = null;
    //
    //       this.listeners = {};
    //     }
    //
    //     setMap(map) {
    //       this.map = map;
    //     }
    //
    //     setValues(values) {
    //       this.values = values;
    //     }
    //
    //     emit(event, x) {
    //       const fns = this.listeners[event];
    //
    //       if (fns) {
    //         fns.forEach(fn => {
    //           fn(x);
    //         });
    //       }
    //     }
    //
    //     addListener(event, fn) {
    //       this.listeners[event] = this.listeners[event] || [];
    //
    //       this.listeners[event].push(fn);
    //     }
    //   }
    // }
  }
};

// Minimal mock to provide the web implementations expected by jest-expo.setup.js
globalThis.expo = globalThis.expo || {};

class EventEmitter {
  constructor() {}
}
class NativeModule {
  constructor() {}
}
class SharedObject {
  constructor() {}
}

globalThis.expo.EventEmitter = EventEmitter;
globalThis.expo.NativeModule = NativeModule;
globalThis.expo.SharedObject = SharedObject;

module.exports = {};

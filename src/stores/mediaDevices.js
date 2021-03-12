import MediaDevices from "media-devices";
import { writable } from "svelte/store";

export const mediaDevices = createStore();

function createStore() {
  const { subscribe, set } = writable([]);

  (async () => {
    const devices = await MediaDevices.enumerateDevices();
    set(devices);

    // Listen for changes in available devices
    MediaDevices.on("devicechange", (changes, devices) => {
      set(devices);
    });
  })();

  return {
    // DeviceList behaves as a Svelte-subscribable store
    subscribe,
  };
}

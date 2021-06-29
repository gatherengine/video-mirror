import { writable, derived } from "svelte/store";

import { defaultDeviceIds } from "./defaultDeviceIds";

export const selectedDeviceIds = createStore();

function createStore() {
  const nullDeviceIds = {
    videoinput: null,
    audioinput: null,
    audiooutput: null,
  };

  const store = writable(nullDeviceIds);

  const readonly = derived(
    [store, defaultDeviceIds],
    ([$store, $defaultDeviceIds], set) => {
      set({
        videoinput: $store.videoinput || $defaultDeviceIds.videoinput,
        audioinput: $store.audioinput || $defaultDeviceIds.audioinput,
        audiooutput: $store.audiooutput || $defaultDeviceIds.audiooutput,
      });
    },
    nullDeviceIds
  );

  return {
    // DeviceList behaves as a Svelte-subscribable store
    subscribe: readonly.subscribe,
    update: store.update,
    set: store.set,
  };
}

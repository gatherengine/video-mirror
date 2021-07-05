import { writable, derived } from "svelte/store";

import { defaultDeviceIds } from "./defaultDeviceIds";
import { permissionRevision } from "./permissionRevision";

export const selectedDeviceIds = writable({
  videoinput: null,
  audioinput: null,
  audiooutput: null,
});

// selectedDeviceIds.subscribe((ids) => {
//   if (ids.videoinput || ids.audioinput || ids.audiooutput)
//     permissionRevision.update((revision) => revision + 1);
// });

// export const selectedDeviceIds = createStore();

// function createStore() {
//   const nullDeviceIds = {
//     videoinput: null,
//     audioinput: null,
//     audiooutput: null,
//   };

//   const store = writable(nullDeviceIds);

//   const readonly = derived(
//     [store, defaultDeviceIds],
//     ([$store, $defaultDeviceIds], set) => {
//       const values = {
//         videoinput: $store.videoinput || $defaultDeviceIds.videoinput,
//         audioinput: $store.audioinput || $defaultDeviceIds.audioinput,
//         audiooutput: $store.audiooutput || $defaultDeviceIds.audiooutput,
//       };
//       set(values);
//     },
//     nullDeviceIds
//   );

//   return {
//     // DeviceList behaves as a Svelte-subscribable store
//     subscribe: readonly.subscribe,
//     update: store.update,
//     set: store.set,
//   };
// }

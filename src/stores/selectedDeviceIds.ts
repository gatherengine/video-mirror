import { writable } from "svelte/store";

export const selectedDeviceIds = writable({
  videoinput: null,
  audioinput: null,
  audiooutput: null,
});

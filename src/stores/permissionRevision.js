import { writable } from "svelte/store";

export const permissionRevision = writable(0);

export function requestPermission() {
  permissionRevision.update((value) => value + 1);
}
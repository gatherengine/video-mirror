import { writable } from "svelte/store";

/**
 * Track the number of times we make a getUserMedia request; when this
 * number increments, we make another request. See localStream store.
 */
export const gumRequestNumber = writable(0);

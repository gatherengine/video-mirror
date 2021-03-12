import { writable } from "svelte/store";

export const videoRequested = writable(true);
export const audioRequested = writable(true);
import { writable, Writable } from "svelte/store";

export const localStream: Writable<MediaStream> = writable(null);

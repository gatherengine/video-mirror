import { writable } from "svelte/store";

/**
 * Represents the current state of the user's desire to have audio or video
 */
export const mediaDesired = writable({ audio: true, video: true });

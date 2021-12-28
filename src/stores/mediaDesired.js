import { writable } from "svelte-local-storage-store";

/**
 * Represents the current state of the user's desire to have audio or video
 */
export const mediaDesired = writable("video-mirror.mediaDesired", {
  audio: true,
  video: true,
});

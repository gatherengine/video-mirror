import { derived, writable } from "svelte/store";

export const mediaDesired = writable({ audio: true, video: true });

// Create a store that ratchets up only what was desired; used for getUserMedia requests
const once = { audio: false, video: false };
export const mediaOnceDesired = derived(
  mediaDesired,
  ($mediaDesired, set) => {
    let changed = false;
    if ($mediaDesired.audio && !once.audio) {
      once.audio = true;
      changed = true;
    }
    if ($mediaDesired.video && !once.video) {
      once.video = true;
      changed = true;
    }
    if (changed) {
      set(once);
    }
  },
  { audio: false, video: false }
);

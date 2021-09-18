import { derived } from "svelte/store";
import { localStream } from "./localStream";

// Create a store that ratchets up what was granted; used for getUserMedia requests
const once = { audio: false, video: false };
export const mediaGrantedOnce = derived(
  localStream,
  ($stream, set) => {
    if (!$stream) return;
    let changed = false;
    if ($stream.getAudioTracks()[0] && !once.audio) {
      once.audio = true;
      changed = true;
    }
    if ($stream.getVideoTracks()[0] && !once.video) {
      once.video = true;
      changed = true;
    }
    if (changed) {
      set(once);
    }
  },
  { audio: false, video: false }
);

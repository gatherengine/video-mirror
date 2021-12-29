import { derived } from "svelte/store";
import { localStream } from "./localStream";
import audioActivity from "audio-activity";

export const localAudioLevel = derived(
  [localStream],
  ([$stream], set) => {
    let activity;
    if ($stream && $stream.getAudioTracks().length) {
      activity = audioActivity($stream, set);
    }

    return () => {
      if (activity) activity.destroy();
    };
  },
  0
);

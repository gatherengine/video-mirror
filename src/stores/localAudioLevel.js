import { derived } from "svelte/store";
import { localStream } from "./localStream";
import hark from "hark";

let harkInstance;
let audioVolume = 0;

export const localAudioLevel = derived(
  [localStream],
  ([$stream], set) => {
    if ($stream && $stream.getAudioTracks().length) {
      harkInstance = hark($stream, { play: false });

      harkInstance.on("volume_change", (dBs, threshold) => {
        let volume = Math.pow(10, dBs / 120);
        if (volume >= 1 || isNaN(volume)) volume = 0;
        if (volume !== audioVolume) {
          set(volume);
          audioVolume = volume;
        }
      });
    }

    return () => {
      if (harkInstance) {
        harkInstance.stop();
        harkInstance = null;
      }
    };
  },
  0
);

import { derived } from "svelte/store";
import { localAudioTrack } from "./localAudioTrack";
import { localVideoTrack } from "./localVideoTrack";

const stream = new MediaStream();

export const localStream = derived(
  [localAudioTrack, localVideoTrack],
  ([$audioTrack, $videoTrack], set) => {
    if (!$audioTrack && !$videoTrack) {
      set(null);
      return;
    }
    
    if ($audioTrack) {
      stream.getAudioTracks().forEach((track) => {
        stream.removeTrack(track);
      });
      stream.addTrack($audioTrack);
    }

    if ($videoTrack) {
      stream.getVideoTracks().forEach((track) => {
        stream.removeTrack(track);
      });
      stream.addTrack($videoTrack);
    }

    set(stream);
  }
);

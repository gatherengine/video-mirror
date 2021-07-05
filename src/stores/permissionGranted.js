import { writable, derived } from "svelte/store";

import { permissionOkToAsk } from "./permissionOkToAsk";
import { permissionWouldBeGranted } from "./permissionWouldBeGranted";

export const permissionGranted = writable(false);
// export const permissionGranted = derived(
//   [permissionOkToAsk, permissionWouldBeGranted],
//   ([$okToAsk, $wouldBeGranted], set) => {

//   },
//   false
// );

async function requestMediaPermission({ audio = true, video = true } = {}) {
  console.log("requestMediaPermission");
  try {
    return await getUserMedia({ audio, video });
    // video: {
    //   deviceId: { exact: videoDeviceId },
    //   ...VIDEO_CONSTRAINTS[this._webcam.resolution],
    // },
    // audio: {
    //   deviceId: { ideal: audioDeviceId},
    //   autoGainControl: false,
    //   echoCancellation: true,
    //   noiseSuppression: true,
    //   channelCount: 2,
    //   sampleRate: 48000,
    //   sampleSize: 16,
    //   volume: 1.0,
    // },
  } catch (err) {
    if (audio && video) {
      return await requestMediaPermission({ audio: true, video: false });
    } else if (audio) {
      return await requestMediaPermission({ video: true, audio: false });
    } else {
      return null;
    }
  }
}
/**
 * localTracks, audioDesired, videoDesired
 * @returns $permissionGranted, blocked(?), tracks
 */
async function requestPermissions() {
  const stream = await requestMediaPermission();

  $audioDesired = true;
  $videoDesired = true;

  if (stream) {
    $permissionGranted = true;
  } else {
    // Visually indicate that the request was blocked if we don't have permission
    setRequestBlocked(true);
  }
}
// $: if (!$permissionGranted && $permissionWouldBeGranted) {
//   requestPermissions();
// }

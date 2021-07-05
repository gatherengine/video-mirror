import { derived } from "svelte/store";

import MediaDevices from "media-devices";

import { audioDesired } from "./audioDesired";
import { videoDesired } from "./videoDesired";

import { audioConstraints } from "./audioConstraints";
import { videoConstraints } from "./videoConstraints";

import { permissionBlocked } from "./permissionBlocked";
import { permissionRevision } from "./permissionRevision";
import { permissionWouldBeGranted } from "./permissionWouldBeGranted";

import { selectedDeviceIds } from "./selectedDeviceIds";

let grantedOnce = false;
let gumRevision = 0;
let previousStream;

export const localStream = derived(
  [
    permissionRevision,
    permissionWouldBeGranted,
    audioDesired,
    videoDesired,
    audioConstraints,
    videoConstraints,
    selectedDeviceIds,
  ],
  (
    [
      $permissionRevision,
      $permissionWouldBeGranted,
      $audioDesired,
      $videoDesired,
      $audioConstraints,
      $videoConstraints,
      $selectedDeviceIds,
    ],
    set
  ) => {
    if (
      $permissionRevision > gumRevision ||
      ($permissionRevision === 0 && $permissionWouldBeGranted && !grantedOnce)
    ) {
      const audio = $audioDesired ? { ...$audioConstraints } : false;
      if (audio && $selectedDeviceIds.audioinput) {
        audio.deviceId = { exact: $selectedDeviceIds.audioinput };
      }

      const video = $videoDesired ? { ...$videoConstraints } : false;
      if (video && $selectedDeviceIds.videoinput) {
        video.deviceId = { exact: $selectedDeviceIds.videoinput };
      }

      if (audio || video) {
        gumRevision = $permissionRevision;

        requestMediaPermission({
          audio,
          video,
        }).then((stream) => {
          previousStream = stream;
          set(stream);
          if (stream) {
            grantedOnce = true;
            permissionBlocked.set(0);
          } else {
            permissionBlocked.update((value) => value + 1);
          }
        });
      }
    }
  },
  null
);

/**
 *
 * @param {boolean|MediaStreamConstraints} audio Either a boolean or an object containing audio constraints
 * @param {boolean|MediaStreamConstraints} video Either a boolean or an object containing video constraints
 * @returns MediaStream?
 */
async function requestMediaPermission({ audio = true, video = true } = {}) {
  try {
    return await MediaDevices.getUserMedia({ audio, video });
  } catch (err) {
    // For Firefox, we need to disable the previously selected Mic, else
    // "DOMException: Concurrent mic process limit."
    if (err.name === "NotReadableError" && previousStream) {
      for (let track of previousStream.getAudioTracks()) {
        track.stop();
      }
      previousStream = null;
      return await requestMediaPermission({ audio, video });
    } else if (audio && video) {
      return await requestMediaPermission({ audio, video: false });
    } else {
      return null;
    }
  }
}

import { derived } from "svelte/store";

import MediaDevices from "media-devices";

import { mediaOnceDesired } from "./mediaDesired";

import { audioConstraints } from "./audioConstraints";
import { videoConstraints } from "./videoConstraints";

import { permissionBlocked } from "./permissionBlocked";
import { permissionRevision } from "./permissionRevision";
import { permissionWouldBeGranted } from "./permissionWouldBeGranted";

import { selectedDeviceIds } from "./selectedDeviceIds";

let grantedOnce = false;
let gumRevision = 0;
let previousStream = null;

export const localStream = derived(
  [
    permissionRevision,
    permissionWouldBeGranted,
    mediaOnceDesired,
    audioConstraints,
    videoConstraints,
    selectedDeviceIds,
  ],
  (
    [
      $permissionRevision,
      $permissionWouldBeGranted,
      $mediaOnceDesired,
      $audioConstraints,
      $videoConstraints,
      $selectedDeviceIds,
    ],
    set
  ) => {
    const audio = $mediaOnceDesired.audio ? { ...$audioConstraints } : false;
    if (audio && $selectedDeviceIds.audioinput) {
      audio.deviceId = { exact: $selectedDeviceIds.audioinput };
    }

    const video = $mediaOnceDesired.video ? { ...$videoConstraints } : false;
    if (video && $selectedDeviceIds.videoinput) {
      video.deviceId = { exact: $selectedDeviceIds.videoinput };
    }

    if (
      ($permissionRevision > gumRevision ||
        ($permissionRevision === 0 &&
          $permissionWouldBeGranted &&
          !grantedOnce)) &&
      (audio || video)
    ) {
      gumRevision = $permissionRevision;
      requestMediaPermission({
        audio,
        video,
        previousStream,
      }).then(
        (stream) => {
          set(stream);
          if (stream) {
            grantedOnce = true;
            previousStream = stream;
            permissionBlocked.set(0);
          } else {
            permissionBlocked.update((value) => value + 1);
          }
        },
        (err) => {
          console.error("getUserMedia request failed", err);
          set(null);
        }
      );
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
async function requestMediaPermission({
  audio = true,
  video = true,
  previousStream = null,
} = {}) {
  try {
    return await MediaDevices.getUserMedia({ audio, video });
  } catch (err) {
    // For Firefox, we need to disable the previously selected Mic, else
    // "DOMException: Concurrent mic process limit."
    if (err.name === "NotReadableError" && previousStream) {
      previousStream.getTracks().forEach((track) => track.stop());
      previousStream = null;
      return await requestMediaPermission({ audio, video });
    } else if (audio && video) {
      return await requestMediaPermission({ audio, video: false });
    } else {
      return null;
    }
  }
}

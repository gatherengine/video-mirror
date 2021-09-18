import { derived, get } from "svelte/store";

import MediaDevices from "media-devices";

import { mediaDesired } from "./mediaDesired";
import { mediaGrantedOnce } from "./mediaGrantedOnce";

import { audioConstraints } from "./audioConstraints";
import { videoConstraints } from "./videoConstraints";

import { permissionBlocked } from "./permissionBlocked";
import { gumRequestNumber } from "./gumRequestNumber";

import { selectedDeviceIds } from "./selectedDeviceIds";

let gumRevision = 0;
let previousStream = null;

export const localStream = derived(
  [
    gumRequestNumber,
    mediaDesired,
    audioConstraints,
    videoConstraints,
    selectedDeviceIds,
  ],
  (
    [
      $gumRequestNumber,
      $mediaDesired,
      $audioConstraints,
      $videoConstraints,
      $selectedDeviceIds,
    ],
    set
  ) => {
    const audio =
      $mediaDesired.audio || get(mediaGrantedOnce).audio
        ? { ...$audioConstraints }
        : false;
    if (audio && $selectedDeviceIds.audioinput) {
      audio.deviceId = { exact: $selectedDeviceIds.audioinput };
    }

    const video =
      $mediaDesired.video || get(mediaGrantedOnce).video
        ? { ...$videoConstraints }
        : false;
    if (video && $selectedDeviceIds.videoinput) {
      video.deviceId = { exact: $selectedDeviceIds.videoinput };
    }

    if (
      ($gumRequestNumber > gumRevision) &&
      (audio || video)
    ) {
      gumRevision = $gumRequestNumber;
      requestMediaPermission({ audio, video }).then(
        (stream) => {
          if (!stream) {
            console.warn("getUserMedia request blocked");
            permissionBlocked.update((value) => value + 1);
          }
          set(stream);
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
async function requestMediaPermission({ audio = true, video = true } = {}) {
  try {
    const stream = await MediaDevices.getUserMedia({ audio, video });
    previousStream = stream;
    return stream;
  } catch (err) {
    // For Firefox, we need to disable the previously selected Mic, else
    // "DOMException: Concurrent mic process limit."
    if (err.name === "NotReadableError" && previousStream) {
      console.warn(
        "getUserMedia NotReadableError: stopping all tracks and trying again..."
      );
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

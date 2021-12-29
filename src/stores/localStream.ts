import { derived, get } from "svelte/store";

import MediaDevices from "media-devices";

import { mediaDesired } from "./mediaDesired";

import { audioConstraints } from "./audioConstraints";
import { videoConstraints } from "./videoConstraints";

import { permissionBlocked } from "./permissionBlocked";
import { gumRequestNumber } from "./gumRequestNumber";
import { gumRevision } from "./gumRevision";

import { selectedDeviceIds } from "./selectedDeviceIds";

let previousStream = null;
const mediaGrantedOnce = { audio: false, video: false };

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
      $mediaDesired.audio || mediaGrantedOnce.audio
        ? { ...$audioConstraints }
        : false;
    if (audio && $selectedDeviceIds.audioinput) {
      (audio as any).deviceId = { exact: $selectedDeviceIds.audioinput };
    }

    const video =
      $mediaDesired.video || mediaGrantedOnce.video
        ? { ...$videoConstraints }
        : false;
    if (video && $selectedDeviceIds.videoinput) {
      (video as any).deviceId = { exact: $selectedDeviceIds.videoinput };
    }

    if ($gumRequestNumber > get(gumRevision) && (audio || video)) {
      gumRevision.set($gumRequestNumber);
      requestMediaPermission({ audio: audio as boolean, video: video as boolean }).then(
        (stream) => {
          if (stream) {
            if (stream.getAudioTracks()[0]) mediaGrantedOnce.audio = true;
            if (stream.getVideoTracks()[0]) mediaGrantedOnce.video = true;
          } else {
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

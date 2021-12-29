import { derived } from "svelte/store";
import { mediaDesired } from "./mediaDesired";
import { mediaDevices } from "./mediaDevices";

function devicesHaveLabels(devices) {
  return devices.some((device) => device.label);
}

export const permissionWouldBeGranted = derived(
  [mediaDevices, mediaDesired],
  ([$mediaDevices, $mediaDesired], set) => {
    if (
      $mediaDevices === null ||
      (!$mediaDesired.audio && !$mediaDesired.video)
    ) {
      set(false);
    } else {
      set(
        // On newer browsers, we need to use local storage to remember if we
        // previously were granted access to audio or video, so they don't have
        // to click twice
        localStorage.getItem("video-mirror.granted") === "true" ||
          // This trick works on older browsers
          devicesHaveLabels($mediaDevices)
      );
    }
  },
  null
);

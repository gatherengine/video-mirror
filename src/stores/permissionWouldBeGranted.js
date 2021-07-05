import { derived } from "svelte/store";
import { mediaDevices } from "./mediaDevices";

function devicesHaveLabels(devices) {
  return devices.some((device) => device.label);
}

export const permissionWouldBeGranted = derived(
  [mediaDevices],
  ([$mediaDevices], set) => {
    console.log('mediaDevices', $mediaDevices);
    if ($mediaDevices === null) {
      set(false);
    } else {
      set(devicesHaveLabels($mediaDevices));
    }
  },
  null
);

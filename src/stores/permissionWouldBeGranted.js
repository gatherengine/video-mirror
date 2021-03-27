import { derived } from "svelte/store";
import { mediaDevices } from "./mediaDevices";

function devicesHaveLabels(devices) {
  return devices.some((device) => device.label);
}

export const permissionWouldBeGranted = derived(
  [mediaDevices],
  ([$mediaDevices], set) => {
    if ($mediaDevices === null) {
      set(null);
    } else {
      set(devicesHaveLabels($mediaDevices));
    }
  },
  null
);

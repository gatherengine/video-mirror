import { gumRequestNumber } from "./stores/gumRequestNumber";
import { mediaDesired } from "./stores/mediaDesired";

export function requestPermission() {
  mediaDesired.set({ audio: true, video: true });
  gumRequestNumber.update((value) => value + 1);
}

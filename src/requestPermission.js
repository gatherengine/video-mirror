import { gumRequestNumber } from "./stores/gumRequestNumber";

export function requestPermission() {
  gumRequestNumber.update((value) => value + 1);
}

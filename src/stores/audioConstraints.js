import { writable } from "svelte/store";

export const audioConstraints = writable({
  autoGainControl: false,
  echoCancellation: true,
  noiseSuppression: true,
  channelCount: 2,
  sampleRate: 48000,
  sampleSize: 16,
  volume: 1.0,
});

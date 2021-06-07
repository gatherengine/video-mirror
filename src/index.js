// The main component!
export { default as VideoMirror } from "./VideoMirror.svelte";
export { getUserMedia } from './getUserMedia'

// Export individual components that might be useful externally
export { default as Audio } from "./Audio.svelte";
export { default as Video } from "./Video.svelte";
export { default as VideoIcon } from "./VideoIcon.svelte";
export { default as AudioIcon } from "./AudioIcon.svelte";
export { default as AudioLevelIndicator } from "./AudioLevelIndicator.svelte";

// Export stores that might be useful externally
export { mediaDevices } from "./stores/mediaDevices";
export { localAudioLevel } from "./stores/localAudioLevel";
export { localAudioTrack } from "./stores/localAudioTrack";
export { localVideoTrack } from "./stores/localVideoTrack";
export { localStream } from "./stores/localStream";
export { audioRequested, videoRequested } from "./stores/mediaRequested";

// Export SVG svelte icons
export * from "./icons";

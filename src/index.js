// The main component!
export { default as VideoMirror } from "./VideoMirror.svelte";

// Export individual components that might be useful externally
export { default as Audio } from "./Audio.svelte";
export { default as Video } from "./Video.svelte";
export { default as VideoIcon } from "./VideoIcon.svelte";
export { default as AudioIcon } from "./AudioIcon.svelte";
export { default as AudioLevelIndicator } from "./AudioLevelIndicator.svelte";
export { requestPermission } from "./requestPermission";
export { attach } from "./attach";

// Export stores
export * from "./stores";

// Export SVG svelte icons
export * from "./icons";

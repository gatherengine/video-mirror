<script>
  import { afterUpdate } from "svelte";

  export let id = "video";
  export let stream;
  export let autoPlay = true;
  // iOS needs this so the video doesn't automatically play full screen
  export let playsInline = true;
  export let muted = false;
  export let volume = 1;

  let audioElement;
  let cachedStream;

  afterUpdate(() => {
    if (cachedStream !== stream) {
      audioElement.srcObject = stream;
      cachedStream = stream;
    }
    audioElement.volume = volume;
  });
</script>

<!-- Note:
  A number of audio attributes are HTML "Boolean attributes", so to prevent the 
  attribute key from being incorrectly rendered, Svelte needs the value to be
  `undefined` when false:
  - autoplay
  - playsinline
-->
<audio
  bind:this={audioElement}
  {id}
  muted={muted ? true : undefined}
  autoPlay={autoPlay ? true : undefined}
  playsInline={playsInline ? true : undefined}
  controls={false} />

<script>
  import { onMount } from "svelte";

  export let id;
  export let stream;
  export let autoPlay = true;
  export let fullscreen = false;
  // iOS needs this so the video doesn't automatically play full screen
  export let playsInline = true;
  export let mirror = false;

  let videoElement;

  onMount(() => {
    videoElement.srcObject = stream;
  });
</script>

<!-- Note:
  A number of video attributes are HTML "Boolean attributes", so to prevent the 
  attribute key from being incorrectly rendered, Svelte needs the value to be
  `undefined` when false:
  - autoplay
  - playsinline
  - disablepictureinpicture
-->
<!-- svelte-ignore a11y-media-has-caption -->
<video
  bind:this={videoElement}
  class:mirror
  class:fullscreen
  {id}
  autoPlay={autoPlay ? true : undefined}
  playsInline={playsInline ? true : undefined}
  disablePictureInPicture="" />

<style>
  video {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
  .mirror {
    transform: scaleX(-1);
  }
  .fullscreen {
    width: 100%;
    height: 100%;
  }
</style>

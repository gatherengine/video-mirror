<script>
  import { afterUpdate } from "svelte";

  export let id = "video";
  export let stream;
  export let autoPlay = true;
  export let fullscreen = false;
  // iOS needs this so the video doesn't automatically play full screen
  export let playsInline = true;
  export let mirror = false;
  export let muted = true;
  export let round = false;
  export let visible = false;

  let videoElement;
  let cachedStream;

  afterUpdate(() => {
    if (cachedStream !== stream) {
      videoElement.srcObject = stream;
      cachedStream = stream;
      visible = true;
    }
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
  class={$$props.class}
  class:mirror
  class:fullscreen
  class:round
  class:visible
  {id}
  muted={muted ? true : undefined}
  autoPlay={autoPlay ? true : undefined}
  playsInline={playsInline ? true : undefined}
  disablePictureInPicture="" />

<style>
  video {
    object-fit: cover;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  @keyframes visible {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .visible {
    animation-name: visible;
    animation-duration: 1s;
    animation-delay: 0.5s;
    animation-timing-function: ease-in;
    animation-fill-mode: forwards;
  }
  .mirror {
    transform: scaleX(-1);
  }
  .fullscreen {
    width: 100%;
    height: 100%;
  }
  .round {
    border-radius: 100%;
  }
</style>

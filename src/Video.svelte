<script>
  import { afterUpdate } from "svelte";
  import { attach } from "./attach";

  export let id = "video";
  // export let stream;
  export let track;
  export let fullscreen = false;
  // iOS needs this so the video doesn't automatically play full screen
  export let mirror = false;
  export let muted = true;
  export let round = false;
  export let visible = false;

  let videoElement;
  let initiallyVisible = visible;
  let eventuallyVisible = visible;

  afterUpdate(() => {
    if (track) {
      if (track.attach) {
        track.attach(videoElement);
      } else {
        attach(videoElement, track);
      }
      eventuallyVisible = true;
    }
  });
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video
  bind:this={videoElement}
  class={$$props.class}
  class:mirror
  class:fullscreen
  class:round
  class:initiallyVisible={visible}
  class:eventuallyVisible={initiallyVisible ? false : eventuallyVisible}
  {id}
  muted={muted ? true : undefined}
  disablePictureInPicture=""
/>

<style>
  video {
    object-fit: cover;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .initiallyVisible {
    opacity: 1 !important;
  }

  @keyframes eventuallyVisible {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .eventuallyVisible {
    animation-name: eventuallyVisible;
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

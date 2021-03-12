<script>
  import { onMount } from "svelte";

  export let id;
  export let stream;
  export let loop = false;
  export let autoPlay = true;

  let audioElement;

  onMount(() => {
    audioElement.srcObject = stream;
  });
</script>

<!-- Note:
  A number of audio attributes are HTML "Boolean attributes", so to prevent the 
  attribute key from being rendered, Svelte needs the value to be `undefined` when false:
  - autoplay
  - loop
-->
<!-- svelte-ignore a11y-media-has-caption -->
<audio
  bind:this={audioElement}
  {id}
  loop={loop ? true : undefined}
  autoPlay={autoPlay ? true : undefined} />

<script>
  import { spring } from "svelte/motion";
  import { localAudioLevel } from "./stores/localAudioLevel";

  // Animation springs
  let audioLevelSpring = spring(0, {
    stiffness: 0.3,
    damping: 0.8,
  });

  $: audioLevelSpring.set($localAudioLevel);
</script>

<indicator
  style="--audio-level:{($audioLevelSpring * 100).toFixed(2) + '%'}"
  class={$$props.class}>
  <slot />
</indicator>

<style>
  indicator {
    display: block;
    position: relative;
  }
  indicator:before {
    content: " ";
    display: block;
    position: absolute;
    width: 100%;
    height: var(--audio-level);
    max-height: 100%;
    bottom: 0;
    left: 0;
    background-color: rgba(70, 180, 74, 0.7);
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
  }
</style>

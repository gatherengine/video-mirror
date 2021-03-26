<script>
  import { spring } from "svelte/motion";
  import { localStream } from "./stores/localStream";
  import Video from "./Video.svelte";

  export let blocked = false;
  export let opaque = false;

  let videoPositionSpring = spring(0, {
    stiffness: 0.5,
    damping: 0.3,
  });

  export function shake() {
    videoPositionSpring.set(10);
    setTimeout(() => videoPositionSpring.set(0), 100);
  }
</script>

<container class:opaque={!opaque}>
  <Video stream={$localStream} mirror={true} />
  <div
    class:opaque
    class:blocked
    class="video-stack overlay"
    style="transform: translate({$videoPositionSpring}px, 0)">
    <slot />
  </div>
</container>

<style>
  container {
    display: flex;
    justify-content: center;

    overflow: hidden;
    border-radius: 10px;
    width: 375px;
    height: 225px;
  }
  .video-stack {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;

    border-radius: 10px;
    width: 375px;
    height: 225px;
  }
  .overlay {
    position: absolute;
  }
  .opaque {
    background-color: #555;
  }
  .blocked {
    background-color: #f55;
  }
</style>

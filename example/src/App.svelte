<script>
  import { VideoMirror } from "video-mirror";

  let isDone = false;
  function done() {
    isDone = true;
  }
</script>

<main>
  {#if isDone}
    Done
  {:else}
    <VideoMirror on:done={done} />
  {/if}
  <div>Additional Instructions</div>
</main>

<style>
  main {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: red;
  }
  div {
    margin-top: 16px;
    color: black;
    text-align: center;
  }
</style>

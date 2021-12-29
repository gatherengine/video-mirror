<script>
  import { VideoMirror } from "video-mirror";
  import SidePanel from "./SidePanel.svelte";

  // i18n or alternative text supported via 'tr' translations object
  let tr = {
    continue: "Proceed",
  };

  let isDone = false;
  function done({ detail }) {
    console.log("DONE", detail);
    isDone = true;
  }
</script>

<main>
  {#if isDone}
    Done
  {:else}
    <VideoMirror {tr} on:done={done} />
  {/if}
  <div>Additional Instructions</div>
</main>

<SidePanel />

<style>
  main {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  div {
    margin-top: 16px;
    color: black;
    text-align: center;
  }
</style>

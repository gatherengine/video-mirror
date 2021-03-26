<script>
  import { IconAudioEnabled, IconAudioDisabled } from "./icons";

  export let enabled = true;
</script>

{#if enabled}
  <IconAudioEnabled />
{:else}
  <IconAudioDisabled />
{/if}

<script lang="ts">
  import { IconAudioEnabled, IconAudioDisabled } from "./icons";

  export let enabled = true;
</script>

{#if enabled}
  <IconAudioEnabled class={$$props.class} />
{:else}
  <IconAudioDisabled class={$$props.class} />
{/if}

<script>
  import { IconVideoEnabled, IconVideoDisabled } from "./icons";

  export let enabled = true;
</script>

{#if enabled}
  <IconVideoEnabled />
{:else}
  <IconVideoDisabled />
{/if}

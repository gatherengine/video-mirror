<script>
  import { createEventDispatcher } from "svelte";

  import groupBy from "./groupBy";
  import Select from "./Select";

  import {
    permissionRevision,
    mediaDevices,
    defaultDeviceIds,
    selectedDeviceIds,
  } from "../stores";

  import {
    IconAudioEnabled,
    IconVideoEnabled,
    IconSoundSpeaker,
  } from "../icons";

  // DeviceSelector sends a 'selected' event when user selects anything
  const dispatch = createEventDispatcher();

  const kinds = ["videoinput", "audioinput", "audiooutput"];
  const icons = {
    videoinput: IconVideoEnabled,
    audioinput: IconAudioEnabled,
    audiooutput: IconSoundSpeaker,
  };

  function handleSelect(option, kind) {
    if (option.value !== $selectedDeviceIds[kind]) {
      $selectedDeviceIds[kind] = option.value;
      $permissionRevision++;
      dispatch("changed", { kind, value: option.value });
    }
    dispatch("selected", { kind, value: option.value });
  }

  /**
   * Options are derived from deviceList: i.e. an object grouped by the kind of device:
   * {
   *   videoinput: [{ ... }, ...],
   *   audioinput: [{ ... }, ...],
   *   audiooutput: [{ ... }, ...],
   * }
   */
  let options = {};
  $: options = groupBy(
    $mediaDevices.map((input) => ({
      value: input.deviceId,
      label: input.label,
      kind: input.kind,
    })),
    "kind"
  );
</script>

{#each kinds as kind}
  {#if options[kind] && options[kind].length > 0}
    <Select
      selected={$defaultDeviceIds[kind]}
      onSelect={(option) => {
        handleSelect(option, kind);
      }}
      options={options[kind]}
      icon={icons[kind]} />
  {/if}
{/each}

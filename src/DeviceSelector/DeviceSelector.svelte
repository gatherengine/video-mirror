<script>
  import { createEventDispatcher } from "svelte";

  import groupBy from "~/utils/groupBy.js";
  import Select from "./Select";

  import {
    deviceList,
    defaultDevices,
    selectedDevices,
  } from "../DeviceListStore.js";

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

  function selected(option, kind) {
    if (option.value !== $selectedDevices[kind]) {
      $selectedDevices[kind] = option.value;
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
    $deviceList.map((input) => ({
      value: input.deviceId,
      label: input.label,
      kind: input.kind,
    })),
    "kind"
  );
</script>

{#each kinds as kind}
  <Select
    selected={$selectedDevices[kind] || $defaultDevices[kind]}
    options={options[kind]}
    onSelect={(option) => {
      selected(option, kind);
    }}
    icon={icons[kind]} />
{/each}

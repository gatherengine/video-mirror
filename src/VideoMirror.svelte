<script>
  import { createEventDispatcher } from "svelte";

  import {
    audioDesired,
    videoDesired,
    localStream,
    mediaDevices,
    permissionBlocked,
    permissionRevision,
    permissionWouldBeGranted,
  } from "./stores";

  import VideoBox from "./VideoBox.svelte";
  import AudioLevelIndicator from "./AudioLevelIndicator.svelte";
  import ContinueButton from "./ContinueButton.svelte";
  import DeviceSelector from "./DeviceSelector";

  import VideoIcon from "./VideoIcon.svelte";
  import AudioIcon from "./AudioIcon.svelte";
  import { IconSettings, IconVideoDisabled } from "./icons";

  export let tr = {};
  export let showButtonBar = true;

  // i18n translations available, if passed in
  const _ = (phrase, key) => tr[key] || tr[phrase] || phrase;

  const dispatch = createEventDispatcher();

  // Local state
  let advancedSettings = false;

  let videoBox = null;

  const toggleAudioDesired = () => ($audioDesired = !$audioDesired);

  const toggleVideoDesired = () => ($videoDesired = !$videoDesired);

  const toggleAdvancedSettings = () => (advancedSettings = !advancedSettings);

  $: if ($permissionBlocked) {
    // Visual feedback already indicates red,
    // so shake it to emphasize error
    videoBox.shake();
  }

  const handleDone = () => {
    dispatch("done", {
      devices: $mediaDevices,
      stream: $localStream,
    });
  };

  const handleDeviceSelected = ({ detail }) => {
    dispatch("device-selected", detail);
  };
</script>

<mirror>
  {#if $localStream}
    <VideoBox bind:this={videoBox} enabled={$videoDesired}>
      {#if !$audioDesired && !$videoDesired}
        <div class="message highlight">
          {_("Join with cam and mic off", "join_cam_mic_off")}
        </div>
      {:else if !$videoDesired}
        <div class="message highlight">
          {_("Join with cam off", "join_cam_off")}
        </div>
      {:else if !$audioDesired}
        <div class="message highlight">
          {_("Join with mic off", "join_mic_off")}
        </div>
      {:else}
        <div />
      {/if}
      {#if showButtonBar}
        <div class="button-bar">
          <button
            on:click={toggleVideoDesired}
            class:track-disabled={!$videoDesired}>
            <icon><VideoIcon enabled={$videoDesired} /></icon>
          </button>
          <button
            class="audio-level-button"
            class:track-disabled={!$audioDesired}
            on:click={toggleAudioDesired}>
            {#if $audioDesired}
              <AudioLevelIndicator>
                <icon class="audio-level-icon">
                  <AudioIcon enabled={$audioDesired} />
                </icon>
              </AudioLevelIndicator>
            {:else}
              <icon class="audio-level-icon">
                <AudioIcon enabled={$audioDesired} />
              </icon>
            {/if}
          </button>
          <button class="corner" on:click={toggleAdvancedSettings}>
            <icon><IconSettings /></icon>
          </button>
        </div>
      {/if}
    </VideoBox>
    <ContinueButton on:click={handleDone}
      >{_("Continue", "continue")}</ContinueButton>
    {#if advancedSettings}
      <div class="advanced-settings">
        <DeviceSelector on:changed={handleDeviceSelected} />
      </div>
    {/if}
  {:else}
    <VideoBox bind:this={videoBox} blocked={$permissionBlocked} opaque={true}>
      <div class="centered-image">
        <icon style="--size:75px"><IconVideoDisabled /></icon>
      </div>
      <div class="message blocked">
        {#if $permissionBlocked}
          {_("Cam and mic are blocked", "cam_mic_blocked")}
        {:else}
          {_("Cam and mic are not active", "cam_mic_not_active")}
        {/if}
      </div>
    </VideoBox>

    {#if $permissionWouldBeGranted === false}
      <ContinueButton
        on:click={() => {
          $permissionRevision += 1;
        }}>
        {#if $permissionBlocked}
          {_("Try Again", "try_again")}
        {:else}
          {_("Request Permissions", "request_perms")}
        {/if}
      </ContinueButton>
    {:else}
      <button-placeholder />
    {/if}
  {/if}
</mirror>

<style>
  mirror {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 500px;
  }
  .centered-image {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    margin-top: 15px;
  }
  .message {
    color: #eee;
    background-color: rgba(33, 33, 33, 0.5);
    border-radius: 10px;
    padding: 8px 15px;
    margin: 8px;
    text-align: center;

    font-family: Verdana, Geneva, Tahoma, sans-serif;
  }
  .button-bar {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .button-bar button {
    display: flex;

    color: white;
    background-color: rgba(33, 33, 33, 0.5);
    border: none;
    border-radius: 8px;
    margin: 8px;

    font-size: 18px;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    padding: 8px 15px;
  }
  .button-bar button.track-disabled {
    background-color: rgba(255, 85, 85, 0.7);
  }
  .button-bar button:hover {
    background-color: rgba(85, 85, 85, 0.7);
  }
  .button-bar button.track-disabled:hover {
    background-color: rgba(255, 115, 115, 0.7);
  }
  .button-bar button.corner {
    position: absolute;
    right: 10px;
  }

  .audio-level-button {
    padding: 0 !important;
  }
  .audio-level-icon {
    margin: 8px 15px;
  }

  icon {
    display: block;
    width: var(--size, 32px);
    height: var(--size, 32px);
    color: white;
  }

  button-placeholder {
    display: block;
    height: 28px;
    margin: 32px auto 8px auto;
    padding: 12px 18px;
  }
</style>

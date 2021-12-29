<script>
  import { createEventDispatcher, onMount } from "svelte";

  import {
    gumRequestNumber,
    gumRevision,
    localStream,
    mediaDesired,
    mediaDevices,
    permissionBlocked,
    permissionWouldBeGranted,
  } from "./stores";

  import VideoBox from "./VideoBox.svelte";
  import AudioLevelIndicator from "./AudioLevelIndicator.svelte";
  import ContinueButton from "./ContinueButton.svelte";
  import DeviceSelector from "./DeviceSelector";
  import { requestPermission } from "./requestPermission";

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

  const toggleAudioDesired = () =>
    mediaDesired.update((state) => ({ ...state, audio: !state.audio }));

  const toggleVideoDesired = () =>
    mediaDesired.update((state) => ({ ...state, video: !state.video }));

  const toggleAdvancedSettings = () => (advancedSettings = !advancedSettings);

  // If we can't even prompt for permission, and visual feedback already
  // indicates red, shake the video to emphasize the problem
  $: if ($permissionBlocked) {
    videoBox.shake();
  }

  const handleDone = () => {
    if (
      $localStream &&
      (($localStream.getAudioTracks()[0] && $mediaDesired.audio) ||
        ($localStream.getVideoTracks()[0] && $mediaDesired.video))
    ) {
      localStorage.setItem("video-mirror.granted", "true");
    } else {
      localStorage.setItem("video-mirror.granted", "false");
    }
    dispatch("done", {
      devices: $mediaDevices,
      stream: $localStream,
    });
  };

  const handleDeviceSelected = ({ detail }) => {
    dispatch("device-selected", detail);
  };

  onMount(() => {
    $gumRequestNumber = $permissionWouldBeGranted ? 1 : 0;
    $gumRevision = 0;
  });
</script>

<mirror>
  {#if $localStream}
    <VideoBox bind:this={videoBox} enabled={$mediaDesired.video}>
      {#if !$mediaDesired.audio && !$mediaDesired.video}
        <div class="message highlight">
          {_("Join with cam and mic off", "join_cam_mic_off")}
        </div>
      {:else if !$mediaDesired.video}
        <div class="message highlight">
          {_("Join with cam off", "join_cam_off")}
        </div>
      {:else if !$mediaDesired.audio}
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
            class:track-disabled={!$mediaDesired.video}
          >
            <icon><VideoIcon enabled={$mediaDesired.video} /></icon>
          </button>
          <button
            class="audio-level-button"
            class:track-disabled={!$mediaDesired.audio}
            on:click={toggleAudioDesired}
          >
            {#if $mediaDesired.audio}
              <AudioLevelIndicator>
                <icon class="audio-level-icon">
                  <AudioIcon enabled={$mediaDesired.audio} />
                </icon>
              </AudioLevelIndicator>
            {:else}
              <icon class="audio-level-icon">
                <AudioIcon enabled={$mediaDesired.audio} />
              </icon>
            {/if}
          </button>
          <button
            class="corner"
            class:inverted={advancedSettings}
            on:click={toggleAdvancedSettings}
          >
            <icon><IconSettings /></icon>
          </button>
        </div>
      {/if}
    </VideoBox>

    <ContinueButton on:click={handleDone}>
      {_("Continue", "continue")}
    </ContinueButton>

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
      <ContinueButton on:click={requestPermission}>
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

  button.inverted {
    background-color: #eee;
  }
  button.inverted:hover {
    background-color: #fff;
  }
  button.inverted icon {
    color: rgba(33, 33, 33, 0.5);
  }

  button-placeholder {
    display: block;
    height: 28px;
    margin: 32px auto 8px auto;
    padding: 12px 18px;
  }
</style>

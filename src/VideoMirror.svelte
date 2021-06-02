<script>
  import { createEventDispatcher } from "svelte";

  import MediaDevices from "media-devices";
  import { mediaDevices } from "./stores/mediaDevices.js";

  import { localVideoTrack } from "./stores/localVideoTrack";
  import { localAudioTrack } from "./stores/localAudioTrack";
  import { localStream } from "./stores/localStream";
  import { permissionWouldBeGranted } from "./stores/permissionWouldBeGranted";

  import { audioRequested, videoRequested } from "./stores/mediaRequested";

  import VideoBox from "./VideoBox.svelte";
  import AudioLevelIndicator from "./AudioLevelIndicator.svelte";
  import ContinueButton from "./ContinueButton.svelte";
  // import DeviceSelector from "./DeviceSelector";

  import VideoIcon from "./VideoIcon.svelte";
  import AudioIcon from "./AudioIcon.svelte";
  import { IconSettings, IconVideoDisabled } from "./icons";

  export let tr = {};
  export let showButtonBar = true;

  // i18n translations available, if passed in
  const _ = (phrase, key) => tr[key] || tr[phrase] || phrase;

  // TODO: make advanced settings work again
  const advancedSettingsSupported = false;

  const dispatch = createEventDispatcher();

  // Local state
  let requestBlocked = false;
  let advancedSettings = false;
  let hasPermission = false;

  let videoBox = null;

  const toggleAudioRequested = () => ($audioRequested = !$audioRequested);

  const toggleVideoRequested = () => ($videoRequested = !$videoRequested);

  const toggleAdvancedSettings = () => (advancedSettings = !advancedSettings);

  function setRequestBlocked(blocked) {
    if (blocked) {
      if (requestBlocked) {
        // Visual feedback already indicates red,
        // so shake it to emphasize error
        videoBox.shake();
      }
      requestBlocked = true;
    } else {
      requestBlocked = false;
    }
  }

  async function requestMediaPermission({ audio = true, video = true } = {}) {
    try {
      return await MediaDevices.getUserMedia({ audio, video });
    } catch (err) {
      if (audio && video) {
        return await requestMediaPermission({ audio: true, video: false });
      } else if (audio) {
        return await requestMediaPermission({ video: true, audio: false });
      } else {
        return null;
      }
    }
  }
  /**
   * localTracks, audioRequested, videoRequested
   * @returns hasPermission, blocked(?), tracks
   */
  async function requestPermissions() {
    const response = await requestMediaPermission();

    $audioRequested = true;
    $videoRequested = true;

    if (response) {
      hasPermission = true;
      response.getTracks().forEach((track) => {
        // prettier-ignore
        switch(track.kind) {
          case 'audio': $localAudioTrack = track; break;
          case 'video': $localVideoTrack = track; break;
        }
      });
    } else {
      // Visually indicate that the request was blocked if we don't have permission
      setRequestBlocked(true);
    }

    // After asking for permission, it's possible the browser will now allow us
    // to see more information about the devices available to the user, so requery
    // await deviceList.requery();
  }

  const handleDone = () => {
    dispatch("done", {
      devices: $mediaDevices,
      audio: $audioRequested ? $localAudioTrack : null,
      video: $videoRequested ? $localVideoTrack : null,
      stream: $localStream,
    });
  };

  $: if (!hasPermission && $permissionWouldBeGranted) {
    requestPermissions();
  }
</script>

<mirror>
  {#if hasPermission}
    <VideoBox bind:this={videoBox} enabled={$videoRequested}>
      {#if !$audioRequested && !$videoRequested}
        <div class="message highlight">
          {_("Join with cam and mic off", "join_cam_mic_off")}
        </div>
      {:else if !$videoRequested}
        <div class="message highlight">
          {_("Join with cam off", "join_cam_off")}
        </div>
      {:else if !$audioRequested}
        <div class="message highlight">
          {_("Join with mic off", "join_mic_off")}
        </div>
      {:else}
        <div />
      {/if}
      {#if showButtonBar}
        <div class="button-bar">
          <button
            on:click={toggleVideoRequested}
            class:track-disabled={!$videoRequested}>
            <icon><VideoIcon enabled={$videoRequested} /></icon>
          </button>
          <button
            class="audio-level-button"
            class:track-disabled={!$audioRequested}
            on:click={toggleAudioRequested}>
            {#if $audioRequested}
              <AudioLevelIndicator>
                <icon class="audio-level-icon">
                  <AudioIcon enabled={$audioRequested} />
                </icon>
              </AudioLevelIndicator>
            {:else}
              <icon class="audio-level-icon">
                <AudioIcon enabled={$audioRequested} />
              </icon>
            {/if}
          </button>
          {#if advancedSettingsSupported}
            <button class="corner" on:click={toggleAdvancedSettings}>
              <icon><IconSettings /></icon>
            </button>
          {/if}
        </div>
      {/if}
    </VideoBox>
    <ContinueButton on:click={handleDone}
      >{_("Continue", "continue")}</ContinueButton>
    {#if advancedSettings}
      <div class="advanced-settings">
        advanced
        <!-- <DeviceSelector
          selected={selectedDevices}
          on:changed={(_) => {
            requestPermissions();
          }} /> -->
      </div>
    {/if}
  {:else}
    <VideoBox bind:this={videoBox} blocked={requestBlocked} opaque={true}>
      <div class="centered-image">
        <icon style="--size:75px"><IconVideoDisabled /></icon>
      </div>
      <div class="message blocked">
        {#if requestBlocked}
          {_("Cam and mic are blocked", "cam_mic_blocked")}
        {:else}
          {_("Cam and mic are not active", "cam_mic_not_active")}
        {/if}
      </div>
    </VideoBox>

    {#if $permissionWouldBeGranted === false}
      <ContinueButton on:click={requestPermissions}>
        {#if requestBlocked}
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
  p {
    width: 375px;
    text-align: center;
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
  /* .blocked-message button {
    border: none;
    background: none;
    text-decoration: underline;
    cursor: pointer;
    color: white;
  } */
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

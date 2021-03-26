<script>
  import { createEventDispatcher } from "svelte";
  import { spring } from "svelte/motion";

  import MediaDevices from "media-devices";
  import { mediaDevices } from "./stores/mediaDevices.js";

  import { localVideoTrack } from "./stores/localVideoTrack";
  import { localAudioTrack } from "./stores/localAudioTrack";
  import { localStream } from "./stores/localStream";

  import { audioRequested, videoRequested } from "./stores/mediaRequested";
  import { localAudioLevel } from "./stores/localAudioLevel";

  import VideoBox from "./VideoBox.svelte";
  import ContinueButton from "./ContinueButton.svelte";
  // import DeviceSelector from "./DeviceSelector";

  import VideoIcon from "./VideoIcon.svelte";
  import AudioIcon from "./AudioIcon.svelte";
  import { IconSettings, IconVideoDisabled } from "./icons";

  const AUDIO_LEVEL_MINIMUM = 0.0;
  // TODO: make advanced settings work again
  const advancedSettingsSupported = false;

  const dispatch = createEventDispatcher();

  // Local state
  let requestBlocked = false;
  let advancedSettings = false;
  let hasPermission = false;

  let videoBox = null;

  // Animation springs
  let audioLevelSpring = spring(0, {
    stiffness: 0.3,
    damping: 0.8,
  });

  const toggleAudioRequested = () => ($audioRequested = !$audioRequested);

  const toggleVideoRequested = () => ($videoRequested = !$videoRequested);

  const toggleAdvancedSettings = () => (advancedSettings = !advancedSettings);

  // const audioLevelChanged = (level) => audioLevelSpring.set(level)
  $: audioLevelSpring.set($localAudioLevel);

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

  function devicesHaveLabels(devices) {
    return devices.some((device) => device.label);
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

  // const handleHelp = () => {
  //   alert("TODO");
  // };

  $: if (!hasPermission && devicesHaveLabels($mediaDevices)) {
    requestPermissions();
  }
</script>

<mirror>
  {#if hasPermission}
    <VideoBox bind:this={videoBox}>
      {#if !$audioRequested && !$videoRequested}
        <div class="message highlight">Join with cam and mic off</div>
      {:else if !$videoRequested}
        <div class="message highlight">Join with cam off</div>
      {:else if !$audioRequested}
        <div class="message highlight">Join with mic off</div>
      {:else}
        <div />
      {/if}
      <div class="button-bar">
        <button
          on:click={toggleVideoRequested}
          class:track-disabled={!$videoRequested}>
          <icon><VideoIcon enabled={$videoRequested} /></icon>
        </button>
        <button
          on:click={toggleAudioRequested}
          class:audio-level={$audioRequested &&
            $audioLevelSpring > AUDIO_LEVEL_MINIMUM}
          class:track-disabled={!$audioRequested}
          style="--audio-level:{($audioLevelSpring * 100).toFixed(2) + '%'}">
          <icon><AudioIcon enabled={$audioRequested} /></icon>
        </button>
        {#if advancedSettingsSupported}
          <button class="corner" on:click={toggleAdvancedSettings}>
            <icon><IconSettings /></icon>
          </button>
        {/if}
      </div>
    </VideoBox>
    <ContinueButton on:click={handleDone}>Continue</ContinueButton>
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
          Cam and mic are blocked
          <!-- <button on:click={handleHelp}>(Need help?)</button> -->
        {:else}Cam and mic are not active{/if}
      </div>
    </VideoBox>

    <p>
      For others to see and hear you, your browser will request access to your
      cam and mic.
    </p>

    <ContinueButton on:click={requestPermissions}>
      {#if requestBlocked}Try Again{:else}Request Permissions{/if}
    </ContinueButton>
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
  .blocked-message button {
    border: none;
    background: none;
    text-decoration: underline;
    cursor: pointer;
    color: white;
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
  .audio-level {
    position: relative;
  }
  .audio-level:before {
    content: " ";
    display: block;
    position: absolute;
    width: 100%;
    height: var(--audio-level);
    max-height: 100%;
    bottom: 0;
    left: 0;
    background-color: rgba(70, 180, 74, 0.7);
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  icon {
    display: block;
    width: var(--size, 32px);
    height: var(--size, 32px);
    color: white;
  }
</style>

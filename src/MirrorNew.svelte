<script>
  import MediaDevices from "media-devices";
  import { mediaDevices } from "./stores/mediaDevices";
  import { localAudioTrack } from "./stores/localAudioTrack";
  import { localVideoTrack } from "./stores/localVideoTrack";
  import Video from "./media/Video.svelte";

  function devicesHaveLabels(devices) {
    return devices.some((device) => device.label);
  }

  async function requestPermission({ audio = true, video = true } = {}) {
    try {
      return await MediaDevices.getUserMedia({ audio, video });
    } catch (err) {
      if (audio && video) {
        return await requestPermission({ audio: true, video: false });
      } else if (audio) {
        return await requestPermission({ video: true, audio: false });
      } else {
        return null;
      }
    }
  }

  async function ask() {
    const response = await requestPermission();
    response.getTracks().forEach((track) => {
      console.log('track', track);
      // prettier-ignore
      switch(track.kind) {
        case 'audio': $localAudioTrack = track; break;
        case 'video': $localVideoTrack = track; break;
      }
    });
  }
</script>

<h1>Mirror-hi</h1>

<div>
  {#if devicesHaveLabels($mediaDevices)}
    {#each $mediaDevices as device}
      <div>
        <a href="#{device.label}" alt={device.deviceId}>
          {device.label} ({device.kind})
        </a>
      </div>
    {/each}
  {/if}

  {#if $localVideoTrack}
    <Video track={$localVideoTrack} mirror={true} />
  {/if}
</div>

<button on:click={ask}>Ask</button>

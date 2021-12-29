<script lang="ts">
  import ProgramView, { Program } from "./ProgramView.svelte";
  import Setup from "./Setup.svelte";

  export let videoDesired = true;
  export let audioDesired = true;

  export let videoDeviceId = null;
  export let audioInputDeviceId = null;
  export let audioOutputDeviceId = null;

  export let videoConstraints = { facingMode: "user" };
  export let audioConstraints = {
    autoGainControl: false,
    echoCancellation: true,
    noiseSuppression: true,
    channelCount: 2,
    sampleRate: 48000,
    sampleSize: 16,
    volume: 1.0,
  };

  function createApp(props): Program {
    return {
      init: [
        {
          screen: "initial",
          videoDesired,
          audioDesired,
          videoDeviceId,
          audioInputDeviceId,
          audioOutputDeviceId,
          videoConstraints,
          audioConstraints,
          permissionBlocked: false,
          permissionWouldBeGranted:
            localStorage.getItem("video-mirror.granted") === "true",
        },
      ],
      update(msg, state) {
        return state;
      },
      view(state, dispatch) {
        return [Setup, { greet: "hi" }];
      },
    };
  }
</script>

<ProgramView {createApp} />

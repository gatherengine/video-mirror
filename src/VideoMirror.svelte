<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import ProgramView from "./ProgramView.svelte";
  import Setup from "./Setup.svelte";
  import type { Program, Dispatch } from "./program";
  import { getUserMedia } from "./commands/getUserMedia";

  export let videoDesired = true;
  export let audioDesired = true;

  export let videoDeviceId = null;
  export let audioInputDeviceId = null;
  export let audioOutputDeviceId = null;

  export let videoConstraints: MediaTrackConstraints = {
    facingMode: "user",
  };
  export let audioConstraints: MediaTrackConstraints = {
    autoGainControl: false,
    echoCancellation: true,
    noiseSuppression: true,
    channelCount: 2,
    sampleRate: 48000,
    sampleSize: 16,
  };

  const dispatchSvelte = createEventDispatcher();

  // Create a single effect from a list of effects
  function batch(commands) {
    return function (dispatch: Dispatch) {
      for (var i = 0; i < commands.length; i++) {
        const effect = commands[i];
        effect(dispatch);
      }
    };
  }

  const storedGrantedKey = "video-mirror.granted";

  function createApp(props): Program {
    const permissionWouldBeGranted =
      localStorage.getItem(storedGrantedKey) === "true";
    return {
      init: [
        {
          videoDesired,
          audioDesired,
          videoDeviceId,
          audioInputDeviceId,
          audioOutputDeviceId,
          videoConstraints,
          audioConstraints,
          permissionBlocked: false,
          permissionWouldBeGranted,
        },
        permissionWouldBeGranted
          ? getUserMedia({ audio: audioConstraints, video: videoConstraints })
          : null,
      ],
      update(msg, state) {
        if (msg.id === "getUserMedia") {
          return [
            { ...state, shake: msg.shake },
            getUserMedia({ audio: audioConstraints, video: videoConstraints }),
          ];
        } else if (msg.id === "gotUserMedia") {
          return [
            { ...state, stream: msg.stream, permissionBlocked: false },
            (dispatch) => {
              localStorage.setItem(storedGrantedKey, "true");
            },
          ];
        } else if (msg.id === "userMediaBlocked") {
          const effects = [
            // If we are blocked this time, don't try to automatically get permission next time
            (dispatch) => localStorage.setItem(storedGrantedKey, "false"),
          ];
          // If this is the 2nd+ time we've been blocked, shake the red/blank video rectangle
          if (state.permissionBlocked && state.shake)
            effects.push((dispatch) => state.shake());
          return [
            { ...state, stream: null, permissionBlocked: true },
            batch(effects),
          ];
        } else if (msg.id === "selectDevice") {
          const newState = { ...state };
          if (msg.kind === "audioinput") {
            newState.audioInputDeviceId = msg.deviceId;
            newState.audioConstraints.deviceId = msg.deviceId;
          } else if (msg.kind === "audiooutput") {
            newState.audioOutputDeviceId = msg.deviceId;
            // TODO: provide a way to test audio output device
          } else if (msg.kind === "videoinput") {
            newState.videoDeviceId = msg.deviceId;
            newState.videoConstraints.deviceId = msg.deviceId;
          } else {
            throw new Error(`unknown device kind: ${msg.kind}`);
          }
          return [
            newState,
            getUserMedia({
              audio: newState.audioConstraints,
              video: newState.videoConstraints,
            }),
          ];
        } else if (msg.id === "toggle") {
          return [{ ...state, [msg.property]: !state[msg.property] }];
        } else if (msg.id === "done") {
          dispatchSvelte("done", state);
          return [state];
        } else {
          return [state];
        }
      },
      view(state, dispatch) {
        return [
          Setup,
          {
            stream: state.stream,
            audioDesired: state.audioDesired,
            videoDesired: state.videoDesired,
            permissionBlocked: state.permissionBlocked,
            toggleAudioDesired: () =>
              dispatch({ id: "toggle", property: "audioDesired" }),
            toggleVideoDesired: () =>
              dispatch({ id: "toggle", property: "videoDesired" }),
            handleRequestPermission: (shake) =>
              dispatch({ id: "getUserMedia", shake }),
            handleDeviceSelected: ({ detail }) => {
              dispatch({
                id: "selectDevice",
                kind: detail.kind,
                deviceId: detail.value,
              });
            },
            handleDone: () => dispatch({ id: "done" }),
          },
        ];
      },
    };
  }
</script>

<ProgramView {createApp} />

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import ProgramView from "./ProgramView.svelte";
  import Setup from "./Setup.svelte";
  import type { Program, Dispatch, DeviceIds, State } from "./program";
  import { getUserMedia } from "./commands/getUserMedia";
  import { localStream } from "./stores/localStream";
  import { get } from "svelte/store";

  export let videoDesired = true;
  export let audioDesired = true;

  export let preferredDeviceIds: DeviceIds = {
    audioinput: null,
    audiooutput: null,
    videoinput: null,
  };

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

  function setConstraintsFromDeviceIds(state: State) {
    if (state.preferredDeviceIds.audioinput) {
      state.audioConstraints.deviceId = state.preferredDeviceIds.audioinput;
    } else {
      delete state.audioConstraints.deviceId;
    }
    if (state.preferredDeviceIds.videoinput) {
      state.videoConstraints.deviceId = state.preferredDeviceIds.videoinput;
    } else {
      delete state.videoConstraints.deviceId;
    }
  }

  const storedGrantedKey = "video-mirror.granted";

  function createApp(props): Program {
    const permissionWouldBeGranted =
      localStorage.getItem(storedGrantedKey) === "true";
    const initialState = {
      stream: get(localStream),
      videoDesired,
      audioDesired,
      preferredDeviceIds,
      videoConstraints,
      audioConstraints,
      permissionBlocked: false,
      permissionWouldBeGranted,
    };
    setConstraintsFromDeviceIds(initialState);

    return {
      init: [
        initialState,
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
          newState.preferredDeviceIds[msg.kind] = msg.deviceId;
          setConstraintsFromDeviceIds(newState);

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
          $localStream = state.stream;
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
            preferredDeviceIds: state.preferredDeviceIds,
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

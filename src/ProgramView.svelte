<script context="module" lang="ts">
  export type State = {
    screen: string;
    videoDesired: boolean;
    audioDesired: boolean;
    videoDeviceId: string;
    audioInputDeviceId: string;
    audioOutputDeviceId: string;
    videoConstraints: any;
    audioConstraints: any;
    permissionBlocked: boolean;
    permissionWouldBeGranted: boolean;
  };
  export type Message = { id: "gum" } | { id: "test" };
  export type Dispatch = (message: Message) => void;
  export type Effect = (dispatch: Dispatch) => void;
  export type Program = {
    init: [State, Effect?];
    update: (msg: Message, state: State) => State;
    view: (state: State, dispatch: Dispatch) => void;
  };
</script>

<!-- This component converts the functional UI state machine (raj) to Svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { runtime } from "raj";

  export let createApp;

  let programView;
  let programComponent;
  let programProps;

  onMount(() => {
    const app = createApp($$props);
    programView = app.view;
    return runtime({
      ...app,
      view: (state, dispatch) => {
        const result = programView(state, dispatch);
        programComponent = result[0];
        if (result[1]) {
          programProps = { ...result[1], dispatch };
        } else {
          programProps = { dispatch };
        }
      },
    });
  });
</script>

<svelte:component this={programComponent} {...programProps} />

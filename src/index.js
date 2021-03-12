export { default as default } from "./Mirror.svelte";

import { localStream } from "./stores/localStream";
localStream.subscribe(($stream) => {
  if ($stream) {
    console.log("stream", $stream.getTracks());
  } else {
    console.log("stream null");
  }
});

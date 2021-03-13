# Video Mirror

Make it easy for web users to set up their mic & camera.

### Happy Path
<div>
<img width="200" src="https://raw.githubusercontent.com/relm-us/video-mirror/main/images/step1.webp" alt="setup step 1">
<img width="200" src="https://raw.githubusercontent.com/relm-us/video-mirror/main/images/step2.webp" alt="setup step 2">
<img width="200" src="https://raw.githubusercontent.com/relm-us/video-mirror/main/images/step3.webp" alt="setup step 3">
</div>

### Error States
<div>
<img width="200" src="https://raw.githubusercontent.com/relm-us/video-mirror/main/images/error1.webp" alt="setup step 3">
<img width="200" src="https://raw.githubusercontent.com/relm-us/video-mirror/main/images/error2.gif" alt="error state 2">
</div>

## Features

- Shows camera stream to help user assess camera setup & personal readiness to join video conference
- Shows visual audio level to help user assess microphone setup
- Allows user to disable camera if desired
- Allows user to disable microphone if desired
- Shows when permission to use cam/mic have not been given
- Allows a user to request permissions by pressing a button
- Autodetects when the user has previously given permissions & skips button press
- Asks for camera & mic together in one dialog, but fails gracefully to one-at-a-time permission dialog if only one media device is available
- Shows visual cue (light red background) when permission was denied
- Shows visual cue (shaking) when permission was denied, and user is requesting permission again, but browser state will no longer allow permissions dialog to be shown
- Works on Firefox, Chrome, Safari, Edge
- 51kb minified (including Svelte); 12kb brotli compressed (also including Svelte)

## TODO

- Advanced device configuration (e.g. pick among multiple microphones, cameras, or speakers)

## Usage

Here's an example in Svelte:

```
<script>
  import VideoMirror from "video-mirror";
</script>

<main>
  <VideoMirror on:done={() => { console.log('setup complete!') } />
</main>
```

## Consuming Svelte Components

Your package.json has a `"svelte"` field pointing to `src/index.js`, which allows Svelte apps to import the source code directly, if they are using a bundler plugin like [rollup-plugin-svelte](https://github.com/sveltejs/rollup-plugin-svelte) or [svelte-loader](https://github.com/sveltejs/svelte-loader) (where [`resolve.mainFields`](https://webpack.js.org/configuration/resolve/#resolve-mainfields) in your webpack config includes `"svelte"`). **This is recommended.**

For everyone else, `npm run build` will bundle your component's source code into a plain JavaScript module (`dist/index.mjs`) and a UMD script (`dist/index.js`). This will happen automatically when you publish your component to npm, courtesy of the `prepublishOnly` hook in package.json.

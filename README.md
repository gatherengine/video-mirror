# Video Mirror

Make it easy for web users to set up their mic & camera.

<div>
<img width="200" src="https://raw.githubusercontent.com/relm-us/video-mirror/main/images/step1.webp" alt="setup step 1">
<img width="200" src="https://raw.githubusercontent.com/relm-us/video-mirror/main/images/step2.webp" alt="setup step 2">
<img width="200" src="https://raw.githubusercontent.com/relm-us/video-mirror/main/images/step3.webp" alt="setup step 3">
</div>

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

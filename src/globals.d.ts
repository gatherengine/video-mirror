namespace svelte.JSX {
  interface VMVideoProps extends SvelteVideoProps {
    disablepictureinpicture?: string | undefined | null;
  }

  interface IntrinsicElements {
    video: HTMLProps<HTMLVideoElement> & VMVideoProps;
  }
}

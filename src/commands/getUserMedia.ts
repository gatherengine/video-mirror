import MediaDevices from "media-devices";
import type { Dispatch } from "../program";

let previousStream;

/**
 *
 * @param {boolean|MediaStreamConstraints} audio Either a boolean or an object containing audio constraints
 * @param {boolean|MediaStreamConstraints} video Either a boolean or an object containing video constraints
 * @returns MediaStream?
 */
export const getUserMedia =
  ({ audio, video }: MediaStreamConstraints) =>
  async (dispatch: Dispatch) => {
    try {
      // For Firefox, we need to disable the previously selected Mic, else
      // "DOMException: Concurrent mic process limit."
      if (previousStream) {
        previousStream.getAudioTracks().forEach((track) => track.stop());
        previousStream = null;
      }
    } catch (err) {
      console.error("unable to stop audio tracks", err);
    }

    try {
      const stream = await MediaDevices.getUserMedia({ audio, video });
      previousStream = stream;
      dispatch({ id: "gotUserMedia", stream });
    } catch (err) {
      console.warn("getUserMedia error", err, { audio, video });
      if (audio && video) {
        // Try getting just audio--maybe they don't have a camera?
        return await getUserMedia({ audio, video: false })(dispatch);
      } else {
        dispatch({ id: "userMediaBlocked" });
      }
    }
  };

import MediaDevices from "media-devices";
import { localVideoTrack } from "./stores/localVideoTrack";
import { localAudioTrack } from "./stores/localAudioTrack";

export async function getUserMedia(
  constraints: MediaStreamConstraints
): Promise<MediaStream> {
  const stream = await MediaDevices.getUserMedia(constraints);
  stream.getTracks().forEach((track) => {
    switch (track.kind) {
      case "audio":
        localAudioTrack.set(track);
        break;
      case "video":
        localVideoTrack.set(track);
        break;
    }
  });
  return stream;
}

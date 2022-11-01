import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { VidePlayer } from "./videPlayer";

const APP_ID = "18802539feb84f018f438b392cb06f06";
const TOKEN =
  "007eJxTYLjkMWG99+eTntvrnLdu8QkJdROc/5Xn3zHZ+9Pl6nMNlcIVGAwtLAyMTI0t01KTLEzSDAwt0kyMLZKMLY2SkwzM0gzM7n9NSG4IZGRgdNrIDCTBEMRnYQhLdipjYAAAQf4epQ==";
const CHANNEL = "VcBv";
const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

const VideoRoom = () => {
  const [user, setUser] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);

  // const handleUserJoined = () => {};
  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
      setUser((previousUser) => [...previousUser, user]);
    }
    if (mediaType === "audio") {
      // setUser((previousUser)=> [...previousUser, user]);
    }
  };

  const handleUserLeft = (user) => {
    setUser((previousUser) => previousUser.filter((u) => u.uid !== user.uid));
  };

  useEffect(() => {
    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);

    client
      .join(APP_ID, CHANNEL, TOKEN, null)
      .then((uid) =>
        Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid])
      )
      .then(([tracks, uid]) => {
        const [audioTrack, videoTrack] = tracks;
        setLocalTracks(tracks);
        setUser((previousUser) => [
          ...previousUser,
          {
            uid,
            videoTrack,
            audioTrack,
          },
        ]);
        client.publish(tracks);
      });
    return () => {
      for (let localTrack of localTracks) {
        localTrack.stop();
        localTrack.close();
      }
      client.off("user-published", handleUserJoined);
      client.off("user-left", handleUserLeft);
      client.unpublish(tracks).then(() => client.leave());
    };
  }, []);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(2,200px)" }}
        >
          {user.map((user) => (
            <VidePlayer key={user.uid} user={user} />
          ))}
        </div>
      </div>
    </>
  );
};
export default VideoRoom;

// "use client"
// import React, { useEffect, useState } from 'react';
// import CameraVideo from './CameraVideo';
// import { pusherClient } from '@/libs/pusher';

// const Livestream = ({ channelName }: { channelName: string }) => {

//   const [videoSrc, setVideoSrc] = useState("")

//   useEffect(() => {
//     pusherClient.subscribe(channelName);

//     pusherClient.bind("video_frame", (video_frames: any) => {
//       setVideoSrc(`data:image/jpeg;base64,${video_frames.frame}`)
//     });



//     return () => {
//       pusherClient.unsubscribe(channelName);
//     };
//   }, [])
//   return (
//     <>

//       {videoSrc !== "" && <img src={videoSrc} width={850} height={250} alt="Processed Video Stream" />}
//       <LiveChart data={data} channel={channelName} />
//       {/* <CameraVideo aspectOne src={"http://192.168.100.56:5000/video_feed"} /> */}
//     </>
//   )
// }

// export default Livestream
"use client";
import React, { useEffect, useState } from 'react';
import LiveChart from './LiveGraph';
import { pusherClient } from '@/libs/pusher';

interface Chunks {
  [key: number]: string;
}
let data = [
  { x: new Date().getTime(), y: 0 },
];
const Livestream = ({ channelName }: { channelName: string }) => {
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [chunks, setChunks] = useState<Chunks>({}); // Store chunks as a dictionary
  const [chunkOrder, setChunkOrder] = useState<any[]>([]); // Track order of chunks for each frame
  const [total_chunks, setTotalChunks] = useState<number>(0); //


  useEffect(() => {
    // Subscribe to the Pusher channel
    pusherClient.subscribe(channelName);

    // Handle incoming video frame chunks
    pusherClient.bind("video_frame_chunk", (data: { chunk: string, chunk_index: number, total_chunks: number }) => {
      const { chunk, chunk_index, total_chunks } = data as any;

      setChunks((prevChunks) => ({
        ...prevChunks,
        [chunk_index]: chunk,
      }));

      // Set chunk order only once per frame
      if (chunk_index === 0) {
        setChunkOrder(Array.from({ length: total_chunks }, (_, i) => i));
        setTotalChunks(total_chunks);
      }
    });

    return () => {
      // Unsubscribe from Pusher channel on cleanup
      pusherClient.unsubscribe(channelName);
    };
  }, [channelName]);

  useEffect(() => {
    // Check if all chunks for a frame have been received

    if (chunkOrder.length > 0 && Object.keys(chunkOrder).length === total_chunks) {


      const fullFrame = chunkOrder.map((_: Chunks, index: number) => chunks[index]).join('');
      // Set the reassembled frame as the image source
      setVideoSrc(`data:image/jpeg;base64,${fullFrame}`);

      // Reset chunks and chunk order for the next frame
      setChunks({});
      setChunkOrder([]);
    }
  }, [chunks, chunkOrder, total_chunks]);

  return (
    <>
      {videoSrc && (
        <img src={videoSrc} width={480} height={480} alt="Processed Video Stream" />
      )}
      <LiveChart data={data} channel={channelName} />
    </>
  );
};

export default Livestream;
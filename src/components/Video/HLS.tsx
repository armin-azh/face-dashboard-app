import React, {useEffect, createRef} from "react";
import Hls from 'hls.js';

interface Props {
    sourceId: string;
}

function HLS(props: Props) {

    const videoRef = createRef<HTMLVideoElement>();

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const url = `${import.meta.env.VITE_API_STREAM_URL}/stream/${props.sourceId}/channel/0/hls/live/index.m3u8`

        if (Hls.isSupported()) {
            const hls = new Hls()
            hls.loadSource(url)
            hls.attachMedia(video)
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url
        }
    }, [videoRef]);


    return <video className='aspect-video w-full h-full' ref={videoRef} autoPlay={true}/>


}


export default React.memo(HLS);
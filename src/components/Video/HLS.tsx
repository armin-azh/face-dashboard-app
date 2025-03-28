import React, {useEffect, createRef, useRef} from "react";
import Hls from 'hls.js';

interface Props {
    sourceId: string;
}

function HLS(props: Props) {

    const videoRef = createRef<HTMLVideoElement>();
    const hlsInstance = useRef<Hls | null>(null);


    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const url = `${import.meta.env.VITE_API_STREAM_URL}/stream/${props.sourceId}/channel/0/hls/live/index.m3u8`

        if (Hls.isSupported()) {
            if (hlsInstance.current) {
                hlsInstance.current.stopLoad(); // Stop fetching the old stream
                hlsInstance.current.detachMedia(); // Detach media first
                hlsInstance.current.destroy(); // Destroy previous instance
            }

            const hls = new Hls()
            hlsInstance.current = hls;
            hls.loadSource(url)
            hls.attachMedia(video)
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url
        }

        return ()=>{
            if(hlsInstance.current){
                if(process.env.NODE_ENV!=='production'){
                    console.log('[HLS]','destroyed')
                }
                hlsInstance.current.stopLoad();
                hlsInstance.current.detachMedia();
                hlsInstance.current.destroy();
                hlsInstance.current = null;
            }
        }
    }, [props.sourceId]);


    return <video className='aspect-video w-full h-full' ref={videoRef} autoPlay={true}/>


}


export default React.memo(HLS);
/*
    WebRTC connection
*/
import React,{useEffect,createRef, useRef} from "react";

interface Props{
    sourceId: string;
}
function Webrtc(props:Props){
    const videoRef = createRef<HTMLVideoElement>();
    const webrtcRef = useRef<RTCPeerConnection | null>(null);


    useEffect(() => {
        if(videoRef.current!==null){
            const video = videoRef.current;
            if (!video) return;
            const webrtc = new RTCPeerConnection({
                iceServers: [{
                    urls: ['stun:stun.l.google.com:19302']
                }],
                // sdpSemantics: 'unified-plan'
            });

            webrtcRef.current = webrtc;

            webrtc.ontrack = function (event) {
                if(process.env.NODE_ENV!=='production'){
                    console.log('[WebRTC]',event.streams.length + ' track is delivered')
                }
                video.srcObject = event.streams[0]
                const isPlaying = video.currentTime > 0 && !video.paused && !video.ended
                    && video.readyState > video.HAVE_CURRENT_DATA;

                if(!isPlaying){
                    video.play()
                        .then(() => console.log('[WebRTC]','start playing'))
                        .catch(error=>{
                            if(error instanceof DOMException){
                                console.info('[WebRTC]','You should interact with browser!');
                            }
                        })
                }
            }
            webrtc.addTransceiver('video', { direction: 'sendrecv' });
            webrtc.onnegotiationneeded = async function handleNegotiationNeeded () {
                const offer = await webrtc.createOffer()

                await webrtc.setLocalDescription(offer)
                const url = `${import.meta.env.VITE_API_STREAM_URL}/stream/${props.sourceId}/channel/0/webrtc`
                fetch(url, {
                    method: 'POST',
                    body: new URLSearchParams({data: btoa(webrtc.localDescription?.sdp || '')})
                })
                    .then(response => response.text())
                    .then(data => {
                        try {
                            webrtc.setRemoteDescription(
                                new RTCSessionDescription({ type: 'answer', sdp: atob(data) })
                            )
                        } catch (e) {
                            console.warn(e)
                        }
                    })
            }
            const webrtcSendChannel = webrtc.createDataChannel('rtsptowebSendChannel')
            webrtcSendChannel.onopen = () => {
                if(process.env.NODE_ENV!=='production'){
                    console.log('[WebRTC]',`${webrtcSendChannel.label} has opened`);
                }
                webrtcSendChannel.send('ping')
            }
            webrtcSendChannel.onclose = () => {
                if(process.env.NODE_ENV!=='production'){
                    console.log('[WebRTC]',`${webrtcSendChannel.label} has closed`)
                }
            }
            webrtcSendChannel.onmessage = event => {
                if(process.env.NODE_ENV!=='production'){
                    console.log(event.data);
                }
            }
        }
        return () => {
            if (webrtcRef.current) {
                if(process.env.NODE_ENV!=='production'){
                    console.log("[WebRTC]", "Cleaning up connection...");
                }
                webrtcRef.current.close();
                webrtcRef.current = null;
            }
        };

    }, [videoRef]);

    return <video className='aspect-video w-full h-full' ref={videoRef} autoPlay={true}/>
}


export default React.memo(Webrtc)
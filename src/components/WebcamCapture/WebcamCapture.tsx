import React, { useRef, useEffect } from 'react';

const WebcamCapture: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch((error) => console.error("Error accessing webcam:", error));
    }, []);

    return <video ref={videoRef} autoPlay playsInline style={{ width: '80%', border: '1px solid black', borderRadius: '10px'}} />;
};

export default WebcamCapture;
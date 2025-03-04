import React, { useRef, useState, useEffect } from 'react';
import './WebcamCapture.css';

const WebcamCapture: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [zoom, setZoom] = useState<number>(1); // Initial zoom level

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch((error) => console.error("Error accessing webcam:", error));
    }, []);

    const zoomIn = () => {
        setZoom((prevZoom) => prevZoom + 0.1); // Increase zoom level
    };

    const zoomOut = () => {
        setZoom((prevZoom) => Math.max(1, prevZoom - 0.1)); // Decrease zoom level, but not below 1
    };

    return (
        <div style={{ position: 'relative', textAlign: 'center' }}>
            <div className="button-container">
                <button className="zoom" onClick={zoomIn}>Zoom In</button>
                <button className="zoom" onClick={zoomOut}>Zoom Out</button>
            </div>
            <div className="video-container">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="video"
                    style={{ transform: `scale(${zoom})` }} // Apply zoom scaling to the video content
                />
            </div>
        </div>
    );
};

export default WebcamCapture;

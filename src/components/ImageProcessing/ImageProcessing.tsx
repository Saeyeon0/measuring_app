import React, { useRef, useState } from 'react';
import "./ImageProcessing.css"

const ImageProcessing: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [measuredSize, setMeasuredSize] = useState<number | null>(null);

    const captureImage = () => {
        const videoElement = document.querySelector('video');
        if (videoElement && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                context.drawImage(videoElement, 0, 0, canvasRef.current.width, canvasRef.current.height);
                setCapturedImage(canvasRef.current.toDataURL('image/png'));
            }
        }
    };

    const measureObject = () => {
        if (canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
                let pixelCount = 0;
                for (let i = 0; i < imageData.data.length; i += 4) {
                    if (imageData.data[i] < 200 || imageData.data[i + 1] < 200 || imageData.data[i + 2] < 200) {
                        pixelCount++;
                    }
                }
                const estimatedSize = (pixelCount / (canvasRef.current.width * canvasRef.current.height)) * 100;
                setMeasuredSize(estimatedSize);
            }
        }
    };

    return (
        <div>
            <button className="capture" onClick={captureImage}>Capture Image</button>
            <button className="measure" onClick={measureObject}>Measure Object</button>
            <canvas ref={canvasRef} width={640} height={480} style={{ display: 'none' }} />
            {capturedImage && <img src={capturedImage} alt="Captured" style={{ marginTop: '10px', width: '80%' }} />}
            {measuredSize !== null && <p>Estimated Object Size: {measuredSize.toFixed(2)}%</p>}
        </div>
    );
};

export default ImageProcessing;
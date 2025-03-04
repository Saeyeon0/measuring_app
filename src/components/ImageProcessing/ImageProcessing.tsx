import React, { useRef, useState } from 'react';
import "./ImageProcessing.css";

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
                let referencePixelCount = 0; // To store the pixel count of the reference object

                // Calculate the reference object (for example, a credit card with known width in mm)
                const referenceWidthMM = 85.6; // Credit card width in mm

                // Loop through the image data to detect the reference object and the target object
                for (let i = 0; i < imageData.data.length; i += 4) {
                    const r = imageData.data[i];
                    const g = imageData.data[i + 1];
                    const b = imageData.data[i + 2];

                    // Assuming the reference object is darker (e.g., credit card), adjust the condition as needed
                    if (r < 200 && g < 200 && b < 200) {
                        pixelCount++;
                    }

                    // Reference object detection (for example, you could set a range of known color for the credit card)
                    if (r < 50 && g < 50 && b < 50) {
                        referencePixelCount++;
                    }
                }

                // Calculate the pixel-to-mm ratio based on the reference object
                const pixelToMMRatio = referenceWidthMM / referencePixelCount;

                // Estimate the size of the target object in mm or cm
                const estimatedSizeMM = pixelCount * pixelToMMRatio;

                // Optionally convert mm to cm
                const estimatedSizeCM = estimatedSizeMM / 10;

                // Update the state with the measured size
                setMeasuredSize(estimatedSizeCM); // or `estimatedSizeMM` depending on desired unit
            }
        }
    };

    return (
        <div>
            <button className="capture" onClick={captureImage}>Capture Image</button>
            <button className="measure" onClick={measureObject}>Measure Object</button>
            <canvas ref={canvasRef} width={640} height={480} style={{ display: 'none' }} />
            {capturedImage && <img src={capturedImage} alt="Captured" style={{ marginTop: '10px', width: '80%' }} />}
            {measuredSize !== null && <p>Estimated Object Size: {measuredSize.toFixed(2)} cm</p>}
        </div>
    );
};

export default ImageProcessing;

import React, { useRef, useState } from 'react';
import "./ImageProcessing.css";

const ImageProcessing: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [measuredSize, setMeasuredSize] = useState<number | null>(null);
    const [floorArea, setFloorArea] = useState<number | null>(null);
    const [ceilingArea, setCeilingArea] = useState<number | null>(null);

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

                // Reference object dimensions (e.g., a credit card)
                const referenceWidthMM = 85.6; // Credit card width in mm

                for (let i = 0; i < imageData.data.length; i += 4) {
                    const r = imageData.data[i];
                    const g = imageData.data[i + 1];
                    const b = imageData.data[i + 2];

                    // Target object detection (adjust condition based on your needs)
                    if (r < 200 && g < 200 && b < 200) {
                        pixelCount++;
                    }

                    // Reference object detection (adjust range for known object color)
                    if (r < 50 && g < 50 && b < 50) {
                        referencePixelCount++;
                    }
                }

                const pixelToMMRatio = referenceWidthMM / referencePixelCount;
                const estimatedSizeMM = pixelCount * pixelToMMRatio;
                const estimatedSizeCM = estimatedSizeMM / 10;

                setMeasuredSize(estimatedSizeCM);
            }
        }
    };

    const measureFloorAndCeiling = () => {
        if (canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
                let floorPixelCount = 0;
                let ceilingPixelCount = 0;
                let referencePixelCount = 0;

                const referenceWidthMM = 85.6; // Reference object width in mm

                for (let i = 0; i < imageData.data.length; i += 4) {
                    const r = imageData.data[i];
                    const g = imageData.data[i + 1];
                    const b = imageData.data[i + 2];

                    // Detect floor (e.g., lighter region at the bottom of the image)
                    if (r > 200 && g > 200 && b > 200) {
                        floorPixelCount++;
                    }

                    // Detect ceiling (e.g., lighter region at the top of the image)
                    if (r > 180 && g > 180 && b > 180) {
                        ceilingPixelCount++;
                    }

                    // Detect reference object
                    if (r < 50 && g < 50 && b < 50) {
                        referencePixelCount++;
                    }
                }

                const pixelToMMRatio = referenceWidthMM / referencePixelCount;

                // Calculate areas in mm² and convert to m²
                const floorAreaMM = floorPixelCount * Math.pow(pixelToMMRatio, 2);
                const ceilingAreaMM = ceilingPixelCount * Math.pow(pixelToMMRatio, 2);

                const floorAreaM2 = floorAreaMM / 1e6; // Convert mm² to m²
                const ceilingAreaM2 = ceilingAreaMM / 1e6; // Convert mm² to m²

                setFloorArea(floorAreaM2);
                setCeilingArea(ceilingAreaM2);
            }
        }
    };

    const deleteCapturedData = () => {
        setCapturedImage(null);
        setMeasuredSize(null);
        setFloorArea(null);
        setCeilingArea(null);
    };

    return (
        <div>
            <button className="capture" onClick={captureImage}>Capture Image</button>
            <button className="measure" onClick={measureObject}>Measure Object</button>
            <button className="measure" onClick={measureFloorAndCeiling}>Measure Floor and Ceiling</button>
            <button className="delete" onClick={deleteCapturedData}>Delete</button>
            <canvas ref={canvasRef} width={640} height={480} style={{ display: 'none' }} />
            {capturedImage && <img src={capturedImage} alt="Captured" style={{ marginTop: '10px', width: '80%' }} />}
            {measuredSize !== null && <p>Estimated Object Size: {measuredSize.toFixed(2)} cm</p>}
            {floorArea !== null && ceilingArea !== null && (
                <div>
                    <p>Estimated Floor Area: {floorArea.toFixed(2)} m²</p>
                    <p>Estimated Ceiling Area: {ceilingArea.toFixed(2)} m²</p>
                </div>
            )}
        </div>
    );
};

export default ImageProcessing;

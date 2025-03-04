import React from 'react';
import WebcamCapture from './components/WebcamCapture/WebcamCapture';
import ImageProcessing from './components/ImageProcessing/ImageProcessing';

const App: React.FC = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <h1>✧Measuring App✧</h1>
            <WebcamCapture />
            <ImageProcessing />
        </div>
    );
};

export default App;
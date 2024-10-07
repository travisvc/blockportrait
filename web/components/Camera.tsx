"use client";

import { useEffect, useRef } from "react";

interface CameraProps {
  stopCamera: boolean;
}

const Camera: React.FC<CameraProps> = ({ stopCamera }) => {
  const videoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (videoRef.current && !stopCamera) {
      videoRef.current.src = `http://localhost:5000/video`;
    } else if (videoRef.current && stopCamera) {
      videoRef.current.src = "";
    }
  }, [stopCamera]);

  return (
    <div>
      <img ref={videoRef} alt="Webcam Feed" className="w-full h-[80%]" />
    </div>
  );
};

export default Camera;

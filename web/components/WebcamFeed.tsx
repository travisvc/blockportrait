"use client";

import { useEffect, useRef } from "react";

interface WebcamFeedProps {
  ipAddress: string;
}

const WebcamFeed: React.FC<WebcamFeedProps> = ({ ipAddress }) => {
  const videoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = `http://${ipAddress}:5000/video`;
    }
  }, [ipAddress]);

  return (
    <div>
      <img ref={videoRef} alt="Webcam Feed" className="w-full h-[80%]" />
    </div>
  );
};

export default WebcamFeed;

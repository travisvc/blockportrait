"use client";

import { useEffect, useRef } from "react";

const WebcamFeed = () => {
  const videoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = `http://localhost:5000/video`;
    }
  }, []);

  return (
    <div>
      <img ref={videoRef} alt="Webcam Feed" className="w-full h-[80%]" />
    </div>
  );
};

export default WebcamFeed;

"use client";

import { useState } from "react";
import WebcamFeed from "@/components/WebcamFeed";
import Navbar from "@/components/Navbar";

const Home = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [tags, setTags] = useState("");

  const getPhoto = async () => {
    try {
      const response = await fetch(`http://localhost:5000/take_photo`);
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setPhoto(imageUrl);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const sendPhotoWithTags = async () => {
    if (!photo) return;

    try {
      const blob = await fetch(photo).then((res) => res.blob());
      const formData = new FormData();
      formData.append("image", blob, "captured_image.jpg");
      formData.append("tags", tags);

      const response = await fetch(`http://localhost:5000/generate_image`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        setPhoto(imageUrl);
        console.log("Generated image received and displayed!");
      } else {
        console.error("Failed to generate image");
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-h-screen text-black">
      <Navbar />

      <div className="flex h-screen w-full">
        <div className="flex flex-col justify-between bg-[#f5f5f5]">
          <div className="flex items-center px-10 w-full h-full">
            <div className="border-4 rounded-lg overflow-hidden max-w-[720px] bg-[#f8f9fa]">
              {!photo ? (
                <WebcamFeed />
              ) : (
                <img src={photo} alt="Captured frame" className="w-full" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-center p-8 w-full bg-neutral-300">
            Take a photo
          </div>
        </div>
        <div className="flex flex-col py-6 px-10 w-5/12 bg-white">
          <button
            onClick={() => getPhoto()}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Take photo
          </button>

          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags for the image"
            className="p-2 border border-gray-400 rounded mt-4"
          />

          <button
            onClick={sendPhotoWithTags}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 mt-4"
            disabled={!photo}
          >
            Generate Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

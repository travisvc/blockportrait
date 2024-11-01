"use client";

import { useState, useEffect } from "react";
import Camera from "@/components/Camera";
import PromptForm from "@/components/PromptForm";

const Home = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState("");
  const [selectedDrawingStyle, setSelectedDrawingStyle] = useState("");
  const [step, setStep] = useState(1);
  const [stopCamera, setStopCamera] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (step === 1) {
      setPhoto(null);
      setStopCamera(false);
      setSelectedEnvironment("");
      setSelectedDrawingStyle("");
    }
  }, [step]);

  const getPhoto = async () => {
    try {
      const response = await fetch(`http://localhost:5000/take_photo`);
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setPhoto(imageUrl);
      setStopCamera(true);
      setStep(2);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const sendPhotoWithTags = async () => {
    if (!photo) return;

    setLoading(true);
    const tags = `${selectedEnvironment}, ${selectedDrawingStyle}`;

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
        setStep(5);
      } else {
        console.error("Failed to generate image");
      }
    } catch (error) {
      console.error("Error sending data:", error);
    } finally {
      setLoading(false);
    }
  };

  const retakePhoto = () => {
    setStep(1);
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col items-center w-full max-h-screen text-black">
      <div className="flex h-screen w-full">
        <div className="flex flex-col justify-between w-full bg-[#f5f5f5] relative">
          <div className="flex items-center justify-center w-full h-screen max-h-screen overflow-hidden">
            {!photo ? (
              <Camera stopCamera={stopCamera} />
            ) : (
              <div className="relative flex items-center justify-center w-full h-full">
                <img src={photo} alt="Failed to generate an image" />
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md text-white text-lg">
                    Generating Image, Please Wait...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col p-6 w-6/12 bg-white">
          {/* Step 1: Take a photo */}
          {step === 1 && (
            <div className="flex flex-col h-full w-full justify-end">
              <button
                onClick={getPhoto}
                className="p-2 w-full bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Take photo
              </button>
            </div>
          )}

          {/* Step 2: Select Environment */}
          {step === 2 && (
            <PromptForm
              title="Select an environment"
              options={[
                { id: "environment-jungle", value: "Jungle", title: "Jungle" },
                { id: "environment-space", value: "Space", title: "Space" },
              ]}
              selectedOption={selectedEnvironment}
              setSelectedOption={setSelectedEnvironment}
              onNext={() => selectedEnvironment && setStep(3)}
              onBack={goBack}
              onRetakePhoto={retakePhoto}
            />
          )}

          {/* Step 3: Select Drawing Style */}
          {step === 3 && (
            <PromptForm
              title="Select a style"
              options={[
                { id: "style-cartoon", value: "Cartoon", title: "Cartoon" },
                { id: "style-artsy", value: "Artsy", title: "Artsy" },
              ]}
              selectedOption={selectedDrawingStyle}
              setSelectedOption={setSelectedDrawingStyle}
              onNext={() => selectedDrawingStyle && setStep(4)}
              onBack={goBack}
              onRetakePhoto={retakePhoto}
            />
          )}

          {/* Step 4: Generate Image */}
          {step === 4 && (
            <div className="flex flex-col h-full w-full justify-between">
              <div className="flex justify-between">
                <button
                  onClick={goBack}
                  className="p-2 border rounded text-neutral-400"
                >
                  <svg
                    className="w-3 h-3 rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </button>
                <button onClick={retakePhoto} className="p-2 border rounded">
                  <img className="w-3 h-3" src="refresh.svg" alt="refresh" />
                </button>
              </div>

              <button
                onClick={sendPhotoWithTags}
                className={`p-2 rounded mt-4 text-white 
                ${
                  loading
                    ? "bg-green-300 cursor-not-allowed opacity-50"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                disabled={
                  !photo ||
                  !selectedEnvironment ||
                  !selectedDrawingStyle ||
                  loading
                }
              >
                Generate Image
              </button>
            </div>
          )}

          {/* Step 5: Take a new photo */}
          {step === 5 && (
            <div className="flex flex-col h-full w-full justify-end">
              <button
                onClick={retakePhoto}
                className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 mt-4"
              >
                Take a new photo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

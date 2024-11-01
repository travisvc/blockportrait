"use client";

import { useState, useEffect } from "react";
import Camera from "@/components/Camera";
import Navbar from "@/components/Navbar";
import RadioInput from "@/components/RadioInput";

const Home = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState("");
  const [selectedDrawingStyle, setSelectedDrawingStyle] = useState("");
  const [step, setStep] = useState(1);
  const [stopCamera, setStopCamera] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    }
  };

  const takeNewPhoto = () => {
    setStep(1);
    setStopCamera(false);
    setPhoto(null);
    setSelectedEnvironment("");
    setSelectedDrawingStyle("");
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col items-center w-full max-h-screen text-black">
      <Navbar />

      <div className="flex h-screen w-full">
        <div className="flex flex-col justify-between w-full bg-[#f5f5f5]">
          <div className="flex items-center justify-center px-10 w-full h-full">
            <div className="border-4 rounded-lg overflow-hidden max-w-[720px] bg-[#f8f9fa]">
              {!photo ? (
                <Camera stopCamera={stopCamera} />
              ) : (
                <img src={photo} alt="Captured frame" className="w-full" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-center p-4 w-full bg-neutral-300">
            <div className="flex items-center justify-center w-full p-3 rounded bg-white">
              Onboarding
              <p>Stijl o Cartoon o Surrealistisch o Realistisch</p>
              <p>Thema o Historisch o Avontuurlijk o Vredig o Natuurlijk</p>
              <p>
                Onderwerp o Gebouwen o Dieren o Planten o Personen o Voertuigen
              </p>
              <p>Achtergrond o Jungle o Modern o Prehistorie</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col py-6 px-10 w-5/12 bg-white">
          {/* Step 1: Take a photo */}
          {step === 1 && (
            <button
              onClick={getPhoto}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Take photo
            </button>
          )}

          {/* Step 2: Select Environment */}
          {step === 2 && (
            <>
              <div className="mt-4">
                <h3 className="mb-5 text-lg font-medium">
                  Select an environment
                </h3>
                <ul className="grid w-full gap-6 md:grid-cols-2">
                  <RadioInput
                    id="environment-jungle"
                    name="environment"
                    value="Jungle"
                    title="Jungle"
                    onChange={setSelectedEnvironment}
                  />
                  <RadioInput
                    id="environment-space"
                    name="environment"
                    value="Space"
                    title="Space"
                    onChange={setSelectedEnvironment}
                  />
                </ul>
              </div>
              <button
                onClick={() => selectedEnvironment && setStep(3)}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4"
                disabled={!selectedEnvironment}
              >
                Next
              </button>
            </>
          )}

          {/* Step 3: Select Drawing Style */}
          {step === 3 && (
            <>
              <div className="mt-4">
                <h3 className="mb-5 text-lg font-medium">
                  Select a drawing style
                </h3>
                <ul className="grid w-full gap-6 md:grid-cols-2">
                  <RadioInput
                    id="style-cartoon"
                    name="drawing_style"
                    value="Cartoon"
                    title="Cartoon"
                    onChange={setSelectedDrawingStyle}
                  />
                  <RadioInput
                    id="style-artsy"
                    name="drawing_style"
                    value="Artsy"
                    title="Artsy"
                    onChange={setSelectedDrawingStyle}
                  />
                </ul>
              </div>
              <button
                onClick={() => selectedDrawingStyle && setStep(4)}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4"
                disabled={!selectedDrawingStyle}
              >
                Next
              </button>
            </>
          )}

          {/* Step 4: Generate Image */}
          {step === 4 && (
            <button
              onClick={sendPhotoWithTags}
              className="p-2 bg-green-500 text-white rounded hover:bg-green-600 mt-4"
              disabled={!photo || !selectedEnvironment || !selectedDrawingStyle}
            >
              Generate Image
            </button>
          )}

          {/* Step 5: Take a new photo */}
          {step === 5 && (
            <button
              onClick={takeNewPhoto}
              className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 mt-4"
            >
              Take a new photo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

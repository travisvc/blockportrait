"use client";

import { useState } from "react";
import WebcamFeed from "@/components/WebcamFeed";
import Navbar from "@/components/Navbar";

const Home = () => {
  const [ipAddress, setIpAddress] = useState("localhost");
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIpAddress(inputValue);
  };

  return (
    <div className="flex flex-col items-center w-full max-h-screen text-black">
      <Navbar />

      <div className="flex h-screen w-full px-28">
        <div className="flex flex-col py-6 px-16 w-2/3 bg-[#f5f5f5]">
          <div className="border-4 rounded-lg overflow-hidden max-w-[720px] bg-[#f8f9fa]">
            <WebcamFeed ipAddress={ipAddress} />
          </div>
        </div>
        <div className="flex flex-col py-6 px-16 w-1/3 bg-white">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <label htmlFor="ipAddress" className="font-bold text-lg">
              Enter IP Address:
            </label>
            <input
              id="ipAddress"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="p-2 border border-gray-400 rounded"
              placeholder="Enter IP address"
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Set IP Address
            </button>
          </form>

          <p>{inputValue}</p>
          <p>{ipAddress}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;

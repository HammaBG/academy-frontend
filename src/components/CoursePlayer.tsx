"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/config/api";

interface CoursePlayerProps {
  videoUrl: string;
}

export function CoursePlayer({ videoUrl }: CoursePlayerProps) {
  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });

  useEffect(() => {
    fetch(`${API_ENDPOINTS.courses}/getVdoCipherOTP`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoId: videoUrl }),
    })
      .then((res) => res.json())
      .then((data) => {
        setVideoData(data);
      })
      .catch((error) => {
        console.error("Error fetching VdoCipher OTP:", error);
      });
  }, [videoUrl]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {videoData.otp && videoData.playbackInfo !== "" && (
        <iframe
          src={`https://player.vdocipher.com/v2/?otp=${videoData?.otp}&playbackInfo=${videoData.playbackInfo}&player=IlvF0hkHRSgG2wGs&autoplay=true&mute=0`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
          allowFullScreen
          allow="encrypted-media; autoplay"
        ></iframe>
      )}
    </div>
  );
}

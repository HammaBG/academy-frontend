"use client";

import { useEffect, useState, useRef } from "react";
import { API_ENDPOINTS } from "@/config/api";

interface CoursePlayerProps {
  videoUrl: string;
  seekTime?: { time: number; trigger: number } | number | null;
}

export function CoursePlayer({ videoUrl, seekTime }: CoursePlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerApiRef = useRef<any>(null);
  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });

  // Dynamically load official VdoCipher API script
  useEffect(() => {
    if (!document.getElementById("vdocipher-api-script")) {
      const script = document.createElement("script");
      script.id = "vdocipher-api-script";
      script.src = "https://player.vdocipher.com/v2/api.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

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

  // Connect VdoCipher Player API when iframe loads
  const handleIframeLoad = () => {
    if (typeof window !== "undefined" && (window as any).VdoPlayer && iframeRef.current) {
      try {
        playerApiRef.current = (window as any).VdoPlayer.getInstance(iframeRef.current);
      } catch (err) {
        console.log("VdoCipher connect init:", err);
      }
    }
  };

  // Handle seeking when seekTime changes
  useEffect(() => {
    const targetSeconds = typeof seekTime === "object" && seekTime !== null ? seekTime.time : seekTime;

    if (targetSeconds !== undefined && targetSeconds !== null && targetSeconds >= 0) {
      try {
        const vdoPlayer = playerApiRef.current || (typeof window !== "undefined" && (window as any).VdoPlayer?.getInstance(iframeRef.current));
        
        if (vdoPlayer) {
          playerApiRef.current = vdoPlayer;
          if (vdoPlayer.video) {
            vdoPlayer.video.currentTime = targetSeconds;
          } else if (typeof vdoPlayer.seek === "function") {
            vdoPlayer.seek(targetSeconds);
          }
        } else if (iframeRef.current?.contentWindow) {
          const win = iframeRef.current.contentWindow;
          win.postMessage(JSON.stringify({ method: "seek", arg: targetSeconds }), "*");
          win.postMessage(JSON.stringify({ type: "seek", time: targetSeconds }), "*");
          win.postMessage(JSON.stringify({ action: "seek", value: targetSeconds }), "*");
        }
      } catch (err) {
        console.error("Error seeking video:", err);
      }
    }
  }, [seekTime]);

  const playerSrc = videoData.otp && videoData.playbackInfo !== ""
    ? `https://player.vdocipher.com/v2/?otp=${videoData?.otp}&playbackInfo=${videoData.playbackInfo}&player=IlvF0hkHRSgG2wGs&autoplay=true&mute=0`
    : "";

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {playerSrc && (
        <iframe
          ref={iframeRef}
          src={playerSrc}
          onLoad={handleIframeLoad}
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

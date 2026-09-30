"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { API_ENDPOINTS } from "@/config/api";

interface CoursePlayerProps {
  videoUrl: string;
  seekTime?: { time: number; trigger: number } | number | null;
}

export function CoursePlayer({ videoUrl, seekTime }: CoursePlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerApiRef = useRef<any>(null);

  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });

  // Check if the videoUrl is a direct file/stream link (Cloudinary, mp4, webm, etc.)
  const isDirectUrl = Boolean(
    videoUrl &&
      (videoUrl.startsWith("http://") ||
        videoUrl.startsWith("https://") ||
        videoUrl.startsWith("blob:") ||
        videoUrl.includes("cloudinary.com") ||
        videoUrl.includes(".mp4") ||
        videoUrl.includes(".webm") ||
        videoUrl.includes(".m3u8") ||
        videoUrl.includes("/video/upload/"))
  );

  // If not a direct URL, it is a VdoCipher videoId, so fetch OTP
  useEffect(() => {
    if (!videoUrl || isDirectUrl) return;

    // Dynamically load official VdoCipher API script only when needed
    if (!document.getElementById("vdocipher-api-script")) {
      const script = document.createElement("script");
      script.id = "vdocipher-api-script";
      script.src = "https://player.vdocipher.com/v2/api.js";
      script.async = true;
      document.body.appendChild(script);
    }

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
  }, [videoUrl, isDirectUrl]);

  // Connect VdoCipher Player API when iframe loads
  const handleIframeLoad = useCallback(() => {
    if (typeof window !== "undefined" && (window as any).VdoPlayer && iframeRef.current) {
      try {
        playerApiRef.current = (window as any).VdoPlayer.getInstance(iframeRef.current);
      } catch (err) {
        console.log("VdoCipher connect init:", err);
      }
    }
  }, []);

  // Handle seeking when seekTime changes
  useEffect(() => {
    const targetSeconds = typeof seekTime === "object" && seekTime !== null ? seekTime.time : seekTime;

    if (targetSeconds === undefined || targetSeconds === null || targetSeconds < 0) {
      return;
    }

    // 1. Direct Video Element (Cloudinary / mp4)
    if (isDirectUrl && videoRef.current) {
      try {
        videoRef.current.currentTime = targetSeconds;
      } catch (err) {
        console.error("Error seeking HTML5 video:", err);
      }
      return;
    }

    // 2. VdoCipher Iframe Player
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
  }, [seekTime, isDirectUrl]);

  // Cloudinary / Direct Video Player
  if (isDirectUrl) {
    return (
      <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          controlsList="nodownload"
          playsInline
          autoPlay
          className="w-full h-full object-contain"
        >
          متصفحك لا يدعم تشغيل هذا الفيديو.
        </video>
      </div>
    );
  }

  // VdoCipher Video Player
  const playerSrc = videoData.otp && videoData.playbackInfo !== ""
    ? `https://player.vdocipher.com/v2/?otp=${videoData?.otp}&playbackInfo=${videoData.playbackInfo}&player=IlvF0hkHRSgG2wGs&autoplay=true&mute=0`
    : "";

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
      {playerSrc ? (
        <iframe
          ref={iframeRef}
          src={playerSrc}
          onLoad={handleIframeLoad}
          className="absolute top-0 left-0 w-full h-full border-0"
          allowFullScreen
          allow="encrypted-media; autoplay"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-text-secondary/60 text-xs font-bold animate-pulse">
          جاري تحميل المشغل...
        </div>
      )}
    </div>
  );
}

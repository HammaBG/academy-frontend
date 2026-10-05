"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { API_ENDPOINTS } from "@/config/api";

interface CoursePlayerProps {
  videoUrl: string;
  seekTime?: { time: number; trigger: number } | number | null;
}

export function CoursePlayer({ videoUrl, seekTime }: CoursePlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const muxPlayerRef = useRef<any>(null);
  const playerApiRef = useRef<any>(null);

  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });
  const [resolvedMuxId, setResolvedMuxId] = useState<string | null>(null);

  // Extract YouTube Video ID if present (supports watch?v=, youtu.be/, shorts/, embed/)
  const getYouTubeId = (url: string): string | null => {
    if (!url) return null;
    const trimmed = url.trim();
    const ytMatch = trimmed.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
    );
    if (ytMatch) return ytMatch[1];
    // If user entered exactly an 11-char YouTube ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    return null;
  };

  const detectedYouTubeId = getYouTubeId(videoUrl);

  // Extract Mux playback ID if present (e.g. stream.mux.com/ID.m3u8, mux:ID, or raw Mux ID)
  const getMuxPlaybackId = (url: string): string | null => {
    if (!url || detectedYouTubeId) return null;
    const trimmed = url.trim();
    if (trimmed.startsWith("mux:")) {
      return trimmed.replace(/^mux:/, "").trim();
    }
    const streamMatch = trimmed.match(/stream\.mux\.com\/([a-zA-Z0-9]+)(\.m3u8)?/);
    if (streamMatch) {
      return streamMatch[1];
    }
    // Standard Mux playback IDs or Asset IDs are alphanumeric (typically 20-50 chars)
    if (/^[a-zA-Z0-9]{15,64}$/.test(trimmed) && !trimmed.match(/^[0-9a-fA-F]{32}$/)) {
      return trimmed;
    }
    return null;
  };

  const detectedMuxId = getMuxPlaybackId(videoUrl);
  const activeMuxPlaybackId = resolvedMuxId || detectedMuxId;

  // Resolve with backend if needed (in case videoUrl was an asset_id or upload_id)
  useEffect(() => {
    if (!videoUrl) return;
    const trimmed = videoUrl.trim();
    // If it looks like a Mux asset/upload/playback ID
    if (/^[a-zA-Z0-9]{15,64}$/.test(trimmed) && !trimmed.match(/^[0-9a-fA-F]{32}$/)) {
      fetch(`${API_ENDPOINTS.courses}/mux/playback/${trimmed}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.data?.playbackId) {
            setResolvedMuxId(data.data.playbackId);
          }
        })
        .catch(() => {});
    }
  }, [videoUrl]);

  // Check if the videoUrl is a direct file/stream link (Cloudinary, mp4, webm, etc.)
  const isDirectUrl = Boolean(
    !detectedYouTubeId &&
      !activeMuxPlaybackId &&
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

  // If not YouTube, not Mux and not a direct URL, it is a VdoCipher videoId, so fetch OTP
  useEffect(() => {
    if (!videoUrl || detectedYouTubeId || isDirectUrl || activeMuxPlaybackId) return;

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

    // 1. Mux Player
    if (activeMuxPlaybackId && muxPlayerRef.current) {
      try {
        muxPlayerRef.current.currentTime = targetSeconds;
      } catch (err) {
        console.error("Error seeking Mux video:", err);
      }
      return;
    }

    // 2. Direct Video Element (Cloudinary / mp4)
    if (isDirectUrl && videoRef.current) {
      try {
        videoRef.current.currentTime = targetSeconds;
      } catch (err) {
        console.error("Error seeking HTML5 video:", err);
      }
      return;
    }

    // 3. VdoCipher Iframe Player
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
  }, [seekTime, isDirectUrl, activeMuxPlaybackId]);

  // YouTube Video Player (specifically for demo / teaser or public previews)
  if (detectedYouTubeId) {
    return (
      <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${detectedYouTubeId}?autoplay=1&rel=0&modestbranding=1`}
          title="Course Demo Video"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  // Mux Video Player
  if (activeMuxPlaybackId) {
    return (
      <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center overflow-hidden">
        <MuxPlayer
          ref={muxPlayerRef}
          playbackId={activeMuxPlaybackId}
          streamType="on-demand"
          autoPlay
          accentColor="#8b3d6f"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

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

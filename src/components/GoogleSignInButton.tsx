"use client";

import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";

export function GoogleSignInButton() {
  const { googleLogin, error } = useAuthStore();
  const router = useRouter();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const scriptId = "google-jssdk";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const handleCallback = async (response: any) => {
      if (response.credential) {
        try {
          await googleLogin(response.credential);
          router.push("/my-courses");
        } catch (err) {
          console.error("Google sign in callback error:", err);
        }
      }
    };

    const initializeGoogleSignIn = () => {
      if (typeof window !== "undefined" && (window as any).google) {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        
        (window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCallback,
        });

        if (buttonRef.current) {
          (window as any).google.accounts.id.renderButton(buttonRef.current, {
            type: "icon",
            theme: "filled_blue",
            size: "large",
            shape: "circle",
          });
          setIsLoaded(true);
        }
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client?hl=ar";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }
  }, [googleLogin, router]);

  return (
    <div className="w-full flex flex-col items-center justify-center py-2">
      {/* Render Google's official circular icon button directly. This is fully clickable and bypasses clickjacking checks. */}
      <div ref={buttonRef} className="min-h-[40px] flex items-center justify-center hover:scale-105 transition-transform duration-200" />
      {error && error.includes("Google") && (
        <p className="text-xs text-red-500 font-bold mt-2 text-center">{error}</p>
      )}
    </div>
  );
}

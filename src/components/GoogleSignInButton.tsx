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
    <div className="flex flex-col items-center justify-center py-1">
      {/* Relative container holding our custom button and the invisible Google click-target */}
      <div className="relative w-12 h-12 flex items-center justify-center group">
        
        {/* Our Custom Designed Expert Button */}
        <div className="w-12 h-12 rounded-full bg-surface border border-border/60 group-hover:border-brand-primary/60 group-hover:bg-brand-primary/5 shadow-md flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 group-active:scale-95 pointer-events-none z-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
        </div>

        {/* The Invisible Google Button overlaid precisely on top to handle authentication clicks securely */}
        {isLoaded && (
          <div 
            ref={buttonRef} 
            className="absolute inset-0 w-full h-full opacity-[0.01] overflow-hidden cursor-pointer z-10 scale-125 origin-center" 
          />
        )}
      </div>

      {error && error.includes("Google") && (
        <p className="text-[11px] text-red-500 font-bold mt-2 text-center">{error}</p>
      )}
    </div>
  );
}

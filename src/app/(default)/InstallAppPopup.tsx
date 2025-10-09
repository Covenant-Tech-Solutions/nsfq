"use client";
import { useEffect, useRef, useState } from "react";

export default function InstallAppPopup() {
  const [show, setShow] = useState(false);
  const deferredPrompt = useRef<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      deferredPrompt.current = e;
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt();
      const { outcome } = await deferredPrompt.current.userChoice;
      if (outcome === "accepted") setShow(false);
    }
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: 0,
        right: 0,
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "auto",
      }}
    >
      <div className="bg-primary text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-4">
        <span className="font-semibold">Install Brainbank</span>
        <button
          className="bg-white text-primary px-4 py-1 rounded-full font-bold"
          onClick={handleInstall}
        >
          Install
        </button>
      </div>
    </div>
  );
}
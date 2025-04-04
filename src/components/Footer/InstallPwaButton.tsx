'use client'
import { useEffect, useState } from "react";
import { MdOutlineInstallDesktop, MdOutlineInstallMobile } from "react-icons/md";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{
        outcome: "accepted" | "dismissed";
        platform: string;
    }>;
}

export default function InstallPwaButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const handler = (event: Event) => {
            event.preventDefault();
            setDeferredPrompt(event as BeforeInstallPromptEvent);
        };

        window.addEventListener("beforeinstallprompt", handler);

        // Detect if the device is mobile
        const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        setIsMobile(isMobileDevice);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    const handleInstall = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
        }
    };

    return (
        <button className="btn btn-primary cursor-pointer" onClick={handleInstall} disabled={!deferredPrompt}>
            {isMobile ? <span className="flex items-center justify-center">Install <MdOutlineInstallMobile className="pl-2 text-2xl"/></span> : <span className="flex items-center justify-center">Install <MdOutlineInstallDesktop className="pl-2 text-2xl"/></span>}
        </button>
    );
}

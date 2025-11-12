"use client";

import Script from "next/script";
import { useEffect } from "react";

export function GovUKFrontendInit() {
    useEffect(() => {
        // Function to initialize GOV.UK Frontend
        const initGOVUKFrontend = () => {
            if (
                typeof window !== "undefined" &&
                window.GOVUKFrontend &&
                typeof window.GOVUKFrontend.initAll === "function"
            ) {
                window.GOVUKFrontend.initAll();
            }
        };

        // Check if already loaded, otherwise poll for it
        if (typeof window !== "undefined") {
            if (window.GOVUKFrontend) {
                initGOVUKFrontend();
            } else {
                // Poll for GOVUKFrontend to be available
                const interval = setInterval(() => {
                    if (window.GOVUKFrontend) {
                        clearInterval(interval);
                        initGOVUKFrontend();
                    }
                }, 50);

                // Clear interval after 5 seconds to avoid infinite polling
                const timeout = setTimeout(() => {
                    clearInterval(interval);
                }, 5000);

                return () => {
                    clearInterval(interval);
                    clearTimeout(timeout);
                };
            }
        }
    }, []);

    return <Script src="/govuk-frontend.js" strategy="afterInteractive" />;
}


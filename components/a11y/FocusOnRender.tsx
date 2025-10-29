"use client";

import { useEffect } from "react";

export default function FocusOnRender({
    selector = "#main-content h1",
}: {
    selector?: string;
}) {
    useEffect(() => {
        // Small delay to ensure DOM is ready and skip link has been processed
        const timeoutId = setTimeout(() => {
            // Check if focus is already within main content (e.g., from skip link)
            const mainContent = document.querySelector("#main-content");
            const activeElement = document.activeElement;

            if (
                mainContent &&
                activeElement &&
                mainContent.contains(activeElement)
            ) {
                // Focus is already in main content, don't override
                return;
            }

            const el = document.querySelector<HTMLElement>(selector);
            if (el) {
                if (!el.hasAttribute("tabindex"))
                    el.setAttribute("tabindex", "-1");
                el.focus();
            }
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [selector]);
    return null;
}

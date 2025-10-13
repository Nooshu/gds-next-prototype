"use client";

import { useEffect } from "react";

export default function FocusOnRender({
    selector = "#main-content h1",
}: {
    selector?: string;
}) {
    useEffect(() => {
        const el = document.querySelector<HTMLElement>(selector);
        if (el) {
            if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
            el.focus();
        }
    }, [selector]);
    return null;
}

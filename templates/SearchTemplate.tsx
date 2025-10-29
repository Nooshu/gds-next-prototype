"use client";

import { useState, useId, useRef, useEffect } from "react";
import GovErrorSummary from "@/components/govuk/GovErrorSummary";
import { GovForm } from "@/components/govuk/GovForm";
import { GovButton } from "@/components/govuk/GovButton";
import { GovFieldError } from "@/components/govuk/GovFieldError";
import { useRouter } from "next/navigation";

export default function SearchTemplate() {
    const [error, setError] = useState("");
    const router = useRouter();
    const inputId = useId();
    const errorId = useId();
    const errorSummaryRef = useRef<HTMLDivElement | null>(null);

    const focusErrorSummary = () => {
        // Find the actual error summary element within the ref
        const errorSummaryElement = errorSummaryRef.current?.querySelector(
            ".govuk-error-summary"
        );
        if (errorSummaryElement) {
            errorSummaryElement.setAttribute("tabindex", "-1");
            (errorSummaryElement as HTMLElement).focus();
        }
    };

    // Focus error summary when error state changes
    useEffect(() => {
        if (error) {
            const timeoutId = setTimeout(() => {
                focusErrorSummary();
            }, 200);
            return () => clearTimeout(timeoutId);
        }
    }, [error]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (typeof window === "undefined") return; // server fallback
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const q = (formData.get("search") as string | null)?.trim() || "";
        if (!q) {
            setError("Enter a court or tribunal name");
            focusErrorSummary();
            return;
        }
        setError("");
        router.push(`/results?q=${encodeURIComponent(q)}`);
    };

    return (
        <GovForm action="/api/search" method="POST" onSubmit={handleSubmit}>
            {error && (
                <div ref={errorSummaryRef}>
                    <GovErrorSummary>
                        <li>
                            <a href={`#${inputId}`}>{error}</a>
                        </li>
                    </GovErrorSummary>
                </div>
            )}
            <div className="govuk-form-group">
                <label className="govuk-label govuk-label--l" htmlFor={inputId}>
                    Find a court or tribunal
                </label>
                <div id={`${inputId}-hint`} className="govuk-hint">
                    Enter the name of a court or tribunal, for example
                    Manchester Crown Court
                </div>
                {error && <GovFieldError id={errorId}>{error}</GovFieldError>}
                <input
                    className={`govuk-input ${
                        error ? "govuk-input--error" : ""
                    }`}
                    id={inputId}
                    name="search"
                    type="text"
                    aria-describedby={
                        error ? `${inputId}-hint ${errorId}` : `${inputId}-hint`
                    }
                    aria-invalid={error ? "true" : "false"}
                />
            </div>
            <GovButton type="submit">Search</GovButton>
        </GovForm>
    );
}

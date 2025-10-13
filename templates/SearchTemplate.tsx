"use client";

import { useState, useId, useRef } from "react";
import GovErrorSummary from "@/components/govuk/GovErrorSummary";
import { GovForm } from "@/components/govuk/GovForm";
import { GovInput } from "@/components/govuk/GovInput";
import { GovButton } from "@/components/govuk/GovButton";
import { useRouter } from "next/navigation";

export default function SearchTemplate() {
    const [error, setError] = useState("");
    const router = useRouter();
    const inputId = useId();
    const errorId = useId();
    const errorSummaryRef = useRef<HTMLDivElement | null>(null);

    const focusErrorSummary = () => {
        if (errorSummaryRef.current) {
            errorSummaryRef.current.setAttribute("tabindex", "-1");
            errorSummaryRef.current.focus();
        }
    };

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
        <GovForm
            action="/api/search"
            method="POST"
            onSubmit={handleSubmit}
        >
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
                <GovInput
                    id={inputId}
                    name="search"
                    hint="Enter the name of a court or tribunal, for example Manchester Crown Court"
                    error={error}
                    describedBy={error ? errorId : undefined}
                />
            </div>
            <GovButton type="submit">
                Search
            </GovButton>
        </GovForm>
    );
}

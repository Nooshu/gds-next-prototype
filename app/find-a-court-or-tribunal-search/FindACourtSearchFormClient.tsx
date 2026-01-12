"use client";

import { useState, useEffect, useRef } from "react";
import { GovParagraph } from "@/components/govuk/GovParagraph";
import GovErrorSummary from "@/components/govuk/GovErrorSummary";
import FocusOnRender from "@/components/a11y/FocusOnRender";

interface FindACourtSearchFormClientProps {
    initialQuery?: string;
    initialError?: string;
}

export function FindACourtSearchFormClient({
    initialQuery = "",
    initialError,
}: FindACourtSearchFormClientProps) {
    const [inputValue, setInputValue] = useState(initialQuery);
    const [error, setError] = useState(initialError || "");
    const [showError, setShowError] = useState(!!initialError);
    const formRef = useRef<HTMLFormElement>(null);

    // Manually attach event listener for client-side enhancement
    useEffect(() => {
        const form = formRef.current;
        if (!form) return;

        const handleFormSubmit = (e: Event) => {
            // Only prevent default if we have JS - this allows server-side fallback
            e.preventDefault();
            e.stopPropagation();

            // Get the current input value from the DOM directly
            const input = form.querySelector(
                'input[name="fullName"]'
            ) as HTMLInputElement;
            const query = input ? input.value.trim() : "";

            if (!query) {
                setError("Enter a court name, address, town or city");
                setShowError(true);
                return;
            }

            // Client-side navigation with query param
            window.location.href = `/find-a-court-or-tribunal-search?q=${encodeURIComponent(query)}`;
        };

        // Attach in capture phase with highest priority
        form.addEventListener("submit", handleFormSubmit, true);

        return () => {
            form.removeEventListener("submit", handleFormSubmit, true);
        };
    }, []);

    return (
        <>
            {showError && (
                <>
                    <FocusOnRender selector=".govuk-error-summary" />
                    <GovErrorSummary title="There is a problem">
                        <li>
                            <a href="#fullName">
                                Enter a court name, address, town or city
                            </a>
                        </li>
                    </GovErrorSummary>
                </>
            )}

            <form
                ref={formRef}
                action="/api/court-search"
                method="POST"
                noValidate
                id="nameSearchForm"
                aria-label="Search for a court or tribunal"
            >
                <div
                    className={`govuk-form-group ${
                        showError ? "govuk-form-group--error" : ""
                    }`}
                >
                    <label
                        className="govuk-label govuk-label--m"
                        htmlFor="fullName"
                    >
                        Enter a court name, address, town or city
                    </label>
                    <div id="fullName-hint" className="govuk-hint">
                        For example, 'Manchester Civil Justice Centre' or 'SW1H 9AJ'
                    </div>
                    {showError && (
                        <p id="fullName-error" className="govuk-error-message">
                            <span className="govuk-visually-hidden">Error:</span>
                            {error}
                        </p>
                    )}
                    <input
                        className={`govuk-input govuk-input--width-20 ${
                            showError ? "govuk-input--error" : ""
                        }`.trim()}
                        id="fullName"
                        name="fullName"
                        type="text"
                        aria-describedby={`fullName-hint${showError ? " fullName-error" : ""}`}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="govuk-button"
                    data-prevent-double-click="true"
                    id="submit-button"
                >
                    Continue
                </button>
            </form>
        </>
    );
}

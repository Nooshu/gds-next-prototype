"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import GovHeader from "@/components/govuk/GovHeader";
import GovContainer from "@/components/govuk/GovContainer";
import { GovH2 } from "@/components/govuk/GovHeading";
import { GovParagraph } from "@/components/govuk/GovParagraph";
import { GovInput } from "@/components/govuk/GovInput";
import { GovButton } from "@/components/govuk/GovButton";
import GovErrorSummary from "@/components/govuk/GovErrorSummary";
import FocusOnRender from "@/components/a11y/FocusOnRender";
import Link from "next/link";
import courtsData from "@/app/_data/courts/index.json";

export default function FindACourtSearchPage() {
    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    // Manually attach event listener to ensure it fires
    useEffect(() => {
        const form = formRef.current;
        if (!form) return;

        const handleFormSubmit = (e: Event) => {
            // Always prevent default form submission
        e.preventDefault();
            e.stopPropagation();
            
            // Get the current input value from the DOM directly
            const input = form.querySelector('input[name="fullName"]') as HTMLInputElement;
            const query = input ? input.value.trim() : '';
            
            if (!query) {
                setError("Enter a court name, address, town or city");
                setShowError(true);
                setHasSearched(false);
                setSearchTerm(""); // Clear search term when validation fails
                return;
            }

            setError("");
            setShowError(false);
        setSearchTerm(query);
            setHasSearched(true);

        // Scroll to results
        setTimeout(() => {
            const resultsElement = document.getElementById("courtResults");
            if (resultsElement) {
                resultsElement.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 100);
    };

        // Attach in capture phase with highest priority
        form.addEventListener('submit', handleFormSubmit, true);
        
        return () => {
            form.removeEventListener('submit', handleFormSubmit, true);
        };
    }, []); // Empty dependencies - attach once on mount

    // Filter courts based on search term - only show results if there's a search term
    const filteredCourts = searchTerm && hasSearched
        ? courtsData.filter((court) =>
              court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              court.area?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];

    // Only show results if user has searched and there's a search term
    const shouldShowResults = hasSearched && searchTerm.length > 0;

    return (
        <>
            <GovHeader />
            <GovContainer>
                <main className="govuk-main-wrapper" id="main-content" role="main">
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

                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds">
                            <GovH2>
                                What is the name or address of the court or tribunal?
                            </GovH2>
                            <GovParagraph>
                                The name of the court or tribunal can be found on a
                                letter, email or text from us.
                            </GovParagraph>
                        </div>
                    </div>

                    <form
                        ref={formRef}
                        noValidate
                        id="nameSearchForm"
                        aria-label="Search for a court or tribunal"
                        method="post"
                        action="#"
                    >
                        <div className={`govuk-form-group ${showError ? 'govuk-form-group--error' : ''}`}>
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
                                className={`govuk-input govuk-input--width-20 ${showError ? 'govuk-input--error' : ''}`.trim()}
                                id="fullName"
                                name="fullName"
                                type="text"
                                aria-describedby={`fullName-hint${showError ? ' fullName-error' : ''}`}
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

                    {shouldShowResults && (
                        <div className="govuk-grid-row">
                            <div
                                className="govuk-grid-column-two-thirds"
                                id="courtResults"
                                role="region"
                                aria-live="polite"
                                aria-label="Search results"
                            >
                                <GovParagraph id="results-count">
                                    We found {filteredCourts.length} court
                                    {filteredCourts.length !== 1 ? "s" : ""} or
                                    tribunal
                                    {filteredCourts.length !== 1 ? "s" : ""} matching
                                    your search for &ldquo;{searchTerm}&rdquo;.
                                </GovParagraph>
                                
                                {filteredCourts.length > 0 && (
                                <GovParagraph>
                                    Most relevant results displayed.
                                </GovParagraph>
                                )}

                                <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

                                <h2 className="govuk-heading-m" id="results-heading">
                                    Search results
                                </h2>

                                {filteredCourts.length > 0 ? (
                                <ul
                                    className="govuk-list"
                                    aria-labelledby="results-heading"
                                    aria-describedby="results-count"
                                >
                                        {filteredCourts.map((court) => {
                                        // Map court slugs to match the expected URLs
                                        const slugMap: Record<string, string> = {
                                            "manchester-crown-court":
                                                "manchester-crown",
                                            "birmingham-crown-court":
                                                "birmingham-crown",
                                            "inner-london-crown-court": "london-crown",
                                        };
                                        const urlSlug =
                                            slugMap[court.slug] || court.slug;

                                        return (
                                                <li key={court.slug} className="govuk-!-margin-bottom-4">
                                                <h3 className="govuk-heading-m">
                                                    <Link
                                                        href={`/find-a-court-or-tribunal/court-details/${urlSlug}`}
                                                            className="govuk-link govuk-link--no-visited-state"
                                                    >
                                                        {court.name}
                                                        {court.name ===
                                                        "Manchester Crown Court"
                                                            ? " (Minshull St)"
                                                            : ""}
                                                    </Link>
                                                </h3>
                                                    {court.type && (
                                                        <GovParagraph className="govuk-!-margin-bottom-1">
                                                            <strong>Type:</strong> {court.type}
                                                        </GovParagraph>
                                                    )}
                                                    {court.area && (
                                                        <GovParagraph className="govuk-!-margin-bottom-0">
                                                            <strong>Area:</strong> {court.area}
                                                        </GovParagraph>
                                                    )}
                                            </li>
                                        );
                                    })}
                                </ul>
                                ) : (
                                    <div className="govuk-inset-text">
                                        <GovParagraph>
                                            No courts or tribunals found for &ldquo;{searchTerm}&rdquo;.
                                        </GovParagraph>
                                        <GovParagraph>
                                            Try a different search term or check your spelling.
                                        </GovParagraph>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </GovContainer>
        </>
    );
}

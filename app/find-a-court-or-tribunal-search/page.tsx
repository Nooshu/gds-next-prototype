"use client";

import { useState, FormEvent } from "react";
import GovHeader from "@/components/govuk/GovHeader";
import GovContainer from "@/components/govuk/GovContainer";
import { GovH2 } from "@/components/govuk/GovHeading";
import { GovParagraph } from "@/components/govuk/GovParagraph";
import Link from "next/link";
import courtsData from "@/app/_data/courts/index.json";

export default function FindACourtSearchPage() {
    const [showResults, setShowResults] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const query = (formData.get("fullName") as string)?.trim() || "";
        setSearchTerm(query);
        setShowResults(true);

        // Scroll to results
        setTimeout(() => {
            const resultsElement = document.getElementById("courtResults");
            if (resultsElement) {
                resultsElement.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 100);
    };

    // Filter courts based on search term
    const filteredCourts = searchTerm
        ? courtsData.filter((court) =>
              court.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];

    // For demo purposes, show all courts if search is empty or matches "manchester"
    const displayCourts =
        searchTerm.toLowerCase() === "manchester" || !searchTerm
            ? courtsData
            : filteredCourts;

    return (
        <>
            <GovHeader />
            <GovContainer>
                <main className="govuk-main-wrapper" id="main-content" role="main">
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
                        method="POST"
                        action="/find-a-court-or-tribunal/name-search"
                        noValidate
                        id="nameSearchForm"
                        aria-label="Search for a court or tribunal"
                        onSubmit={handleSubmit}
                    >
                        <div className="govuk-form-group">
                            <label
                                className="govuk-label govuk-label--m"
                                htmlFor="fullName"
                            >
                                Enter a court name, address, town or city
                            </label>
                            <div id="fullName-hint" className="govuk-hint">
                                For example, &apos;Manchester Civil Justice
                                Centre&apos; or &apos;SW1H 9AJ&apos;
                            </div>
                            <input
                                className="govuk-input govuk-input--width-20"
                                id="fullName"
                                name="fullName"
                                type="text"
                                aria-describedby="fullName-hint"
                                defaultValue={searchQuery}
                            />
                        </div>
                        <button
                            type="submit"
                            className="govuk-button"
                            data-module="govuk-button"
                            id="submit-button"
                            data-govuk-button-init=""
                        >
                            Continue
                        </button>
                    </form>

                    {showResults && (
                        <div className="govuk-grid-row">
                            <div
                                className="govuk-grid-column-two-thirds"
                                id="courtResults"
                                style={{ display: "block" }}
                                role="region"
                                aria-live="polite"
                                aria-label="Search results"
                            >
                                <GovParagraph id="results-count">
                                    We found {displayCourts.length} court
                                    {displayCourts.length !== 1 ? "s" : ""} or
                                    tribunal
                                    {displayCourts.length !== 1 ? "s" : ""} matching
                                    your search for &apos;{searchTerm || "manchester"}&apos;.
                                </GovParagraph>
                                <GovParagraph>
                                    Most relevant results displayed.
                                </GovParagraph>

                                <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

                                <h2 className="govuk-heading-m" id="results-heading">
                                    Search results
                                </h2>

                                <ul
                                    className="govuk-list"
                                    aria-labelledby="results-heading"
                                    aria-describedby="results-count"
                                >
                                    {displayCourts.map((court) => {
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
                                            <li key={court.slug}>
                                                <h3 className="govuk-heading-m">
                                                    <Link
                                                        href={`/find-a-court-or-tribunal/court-details/${urlSlug}`}
                                                        className="govuk-link"
                                                    >
                                                        {court.name}
                                                        {court.name ===
                                                        "Manchester Crown Court"
                                                            ? " (Minshull St)"
                                                            : ""}
                                                    </Link>
                                                </h3>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    )}
                </main>
            </GovContainer>
        </>
    );
}

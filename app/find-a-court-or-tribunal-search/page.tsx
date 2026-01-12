import { Suspense } from "react";
import GovHeader from "@/components/govuk/GovHeader";
import GovContainer from "@/components/govuk/GovContainer";
import { GovH2 } from "@/components/govuk/GovHeading";
import { GovParagraph } from "@/components/govuk/GovParagraph";
import GovErrorSummary from "@/components/govuk/GovErrorSummary";
import FocusOnRender from "@/components/a11y/FocusOnRender";
import Link from "next/link";
import courtsData from "@/app/_data/courts/index.json";
import { FindACourtSearchFormClient } from "./FindACourtSearchFormClient";

interface FindACourtSearchPageProps {
    searchParams: Promise<{
        q?: string;
        error?: string;
    }>;
}

// Server component that renders search results
function SearchResults({ query }: { query: string }) {
    const filteredCourts = courtsData.filter(
        (court) =>
            court.name.toLowerCase().includes(query.toLowerCase()) ||
            court.area?.toLowerCase().includes(query.toLowerCase())
    );

    return (
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
                    {filteredCourts.length !== 1 ? "s" : ""} or tribunal
                    {filteredCourts.length !== 1 ? "s" : ""} matching your search
                    for &ldquo;{query}&rdquo;.
                </GovParagraph>

                {filteredCourts.length > 0 && (
                    <GovParagraph>Most relevant results displayed.</GovParagraph>
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
                                "manchester-crown-court": "manchester-crown",
                                "birmingham-crown-court": "birmingham-crown",
                                "inner-london-crown-court": "london-crown",
                            };
                            const urlSlug = slugMap[court.slug] || court.slug;

                            return (
                                <li key={court.slug} className="govuk-!-margin-bottom-4">
                                    <h3 className="govuk-heading-m">
                                        <Link
                                            href={`/find-a-court-or-tribunal/court-details/${urlSlug}`}
                                            className="govuk-link govuk-link--no-visited-state"
                                        >
                                            {court.name}
                                            {court.name === "Manchester Crown Court"
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
                            No courts or tribunals found for &ldquo;{query}&rdquo;.
                        </GovParagraph>
                        <GovParagraph>
                            Try a different search term or check your spelling.
                        </GovParagraph>
                    </div>
                )}
            </div>
        </div>
    );
}

export default async function FindACourtSearchPage({
    searchParams,
}: FindACourtSearchPageProps) {
    const params = await searchParams;
    const query = params.q || "";
    const error = params.error;

    return (
        <>
            <GovHeader />
            <GovContainer>
                <main className="govuk-main-wrapper" id="main-content" role="main">
                    {error && (
                        <>
                            <FocusOnRender selector=".govuk-error-summary" />
                            <GovErrorSummary title="There is a problem">
                                <li>
                                    <a href="#fullName">{error}</a>
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

                    <Suspense
                        fallback={
                            <form
                                action="/api/court-search"
                                method="POST"
                                noValidate
                                id="nameSearchForm"
                                aria-label="Search for a court or tribunal"
                            >
                                <div className="govuk-form-group">
                                    <label
                                        className="govuk-label govuk-label--m"
                                        htmlFor="fullName"
                                    >
                                        Enter a court name, address, town or city
                                    </label>
                                    <div id="fullName-hint" className="govuk-hint">
                                        For example, 'Manchester Civil Justice Centre' or
                                        'SW1H 9AJ'
                                    </div>
                                    <input
                                        className="govuk-input govuk-input--width-20"
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        aria-describedby="fullName-hint"
                                        required
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
                        }
                    >
                        <FindACourtSearchFormClient initialQuery={query} initialError={error} />
                    </Suspense>

                    {query && <SearchResults query={query} />}
                </main>
            </GovContainer>
        </>
    );
}

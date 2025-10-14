import { Suspense } from "react";
import FocusOnRender from "@/components/a11y/FocusOnRender";
import GovHeader from "@/components/govuk/GovHeader";
import GovContainer from "@/components/govuk/GovContainer";
import { GovH1, GovH2 } from "@/components/govuk/GovHeading";
import Link from "next/link";
import { Metadata } from "next";

interface Court {
    slug: string;
    name: string;
    type: string;
    area: string;
}

interface SearchParams {
    q?: string;
}

interface ResultsPageProps {
    searchParams: SearchParams;
}

export async function generateMetadata({
    searchParams,
}: ResultsPageProps): Promise<Metadata> {
    const query = searchParams.q || "";
    const title = query ? `Results for "${query}"` : "Search results";
    return {
        title,
    };
}

async function getCourts(): Promise<Court[]> {
    const courts = await import("../_data/courts/index.json");
    return courts.default;
}

function ResultsList({ query }: { query: string }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResultsContent query={query} />
        </Suspense>
    );
}

async function ResultsContent({ query }: { query: string }) {
    const courts = await getCourts();

    const filteredCourts = courts.filter(
        (court) =>
            court.name.toLowerCase().includes(query.toLowerCase()) ||
            court.type.toLowerCase().includes(query.toLowerCase()) ||
            court.area.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <>
            <div
                aria-live="polite"
                aria-atomic="true"
                className="govuk-visually-hidden"
            >
                {filteredCourts.length} results found for "{query}"
            </div>

            {filteredCourts.length === 0 ? (
                <div className="govuk-inset-text">
                    <p>No courts or tribunals found for "{query}".</p>
                    <p>Try a different search term or check your spelling.</p>
                </div>
            ) : (
                <ul className="govuk-list">
                    {filteredCourts.map((court) => (
                        <li
                            key={court.slug}
                            className="govuk-!-margin-bottom-4"
                        >
                            <div className="govuk-summary-list">
                                <div className="govuk-summary-list__row">
                                    <dt className="govuk-summary-list__key">
                                        <Link
                                            href={`/courts/${court.slug}`}
                                            className="govuk-link govuk-link--no-visited-state"
                                        >
                                            {court.name}
                                        </Link>
                                    </dt>
                                    <dd className="govuk-summary-list__value">
                                        {court.type}
                                    </dd>
                                    <dd className="govuk-summary-list__value">
                                        {court.area}
                                    </dd>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}

export default function ResultsPage({ searchParams }: ResultsPageProps) {
    const query = searchParams.q || "";

    return (
        <>
            <FocusOnRender />
            <GovHeader serviceName="Find a court or tribunal" />
            <main className="govuk-main-wrapper" id="main-content" role="main">
                <GovContainer>
                    <GovH1>Search results</GovH1>
                    {query && (
                        <>
                            <p className="govuk-body">
                                Results for: <strong>"{query}"</strong>
                            </p>
                            <ResultsList query={query} />
                        </>
                    )}
                    {!query && (
                        <div className="govuk-inset-text">
                            <p>
                                Please enter a search term to find courts and
                                tribunals.
                            </p>
                        </div>
                    )}
                </GovContainer>
            </main>
        </>
    );
}

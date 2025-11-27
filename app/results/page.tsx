import { Suspense } from "react";
import FocusOnRender from "@/components/a11y/FocusOnRender";
import GovHeader from "@/components/govuk/GovHeader";
import GovContainer from "@/components/govuk/GovContainer";
import { GovH1 } from "@/components/govuk/GovHeading";
import { GovParagraph } from "@/components/govuk/GovParagraph";
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
    searchParams: Promise<SearchParams>;
}

export async function generateMetadata({
    searchParams,
}: ResultsPageProps): Promise<Metadata> {
    const params = await searchParams;
    const query = params.q || "";
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
                id="live-region"
                aria-live="polite"
                aria-atomic="true"
                className="govuk-visually-hidden"
                key={`results-${query}`}
            >
                {filteredCourts.length} results found for &ldquo;{query}&rdquo;
            </div>

            {filteredCourts.length === 0 ? (
                <div className="govuk-inset-text">
                    <p>No courts or tribunals found for &ldquo;{query}&rdquo;.</p>
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

export default async function ResultsPage({
    searchParams,
}: ResultsPageProps) {
    const params = await searchParams;
    const query = params.q || "";

    return (
        <>
            <FocusOnRender />
            <GovHeader />
            <main
                className="govuk-main-wrapper"
                id="main-content"
                role="main"
                tabIndex={-1}
            >
                <GovContainer>
                    <GovH1>Search results</GovH1>
                    {query && (
                        <>
                            <GovParagraph>
                                Results for: <strong>&ldquo;{query}&rdquo;</strong>
                            </GovParagraph>
                            <ResultsList query={query} />
                        </>
                    )}
                    {!query && (
                        <div className="govuk-inset-text">
                            <GovParagraph>
                                Please enter a search term to find courts and
                                tribunals.
                            </GovParagraph>
                        </div>
                    )}
                </GovContainer>
            </main>
        </>
    );
}

import GovHeader from "@/components/govuk/GovHeader";
import GovContainer from "@/components/govuk/GovContainer";
import { GovH1 } from "@/components/govuk/GovHeading";
import SearchTemplate from "@/templates/SearchTemplate";

interface HomePageProps {
    searchParams?: { error?: string };
}

export default function Home({ searchParams }: HomePageProps) {
    return (
        <>
            <GovHeader serviceName="Find a court or tribunal" />
            <main className="govuk-main-wrapper" id="main-content" role="main">
                <GovContainer>
                    <GovH1>Find a court or tribunal</GovH1>
                    {searchParams?.error && (
                        <div
                            className="govuk-error-summary"
                            role="alert"
                            aria-labelledby="pe-error-title"
                        >
                            <h2
                                id="pe-error-title"
                                className="govuk-error-summary__title"
                            >
                                There is a problem
                            </h2>
                            <div className="govuk-error-summary__body">
                                <ul className="govuk-list govuk-error-summary__list">
                                    <li>{searchParams.error}</li>
                                </ul>
                            </div>
                        </div>
                    )}
                    <SearchTemplate />
                </GovContainer>
            </main>
        </>
    );
}

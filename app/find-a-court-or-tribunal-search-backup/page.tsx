import GovHeader from "@/components/govuk/GovHeader";
import GovContainer from "@/components/govuk/GovContainer";
import { GovH1 } from "@/components/govuk/GovHeading";
import SearchTemplate from "@/templates/SearchTemplate";

export const metadata = {
    title: "Find a court or tribunal",
};

interface FindACourtPageProps {
    searchParams?: Promise<{ error?: string }>;
}

export default async function FindACourtPage({
    searchParams,
}: FindACourtPageProps) {
    const params = await searchParams;
    return (
        <>
            <GovHeader />
            <main
                className="govuk-main-wrapper"
                id="main-content"
                role="main"
                tabIndex={-1}
            >
                <GovContainer>
                    <GovH1>Find a court or tribunal</GovH1>
                    {params?.error && (
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
                                    <li>{params.error}</li>
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


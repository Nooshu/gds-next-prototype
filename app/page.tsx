import GovHeader from "@/components/govuk/GovHeader";
import GovContainer from "@/components/govuk/GovContainer";
import { GovParagraph } from "@/components/govuk/GovParagraph";
import Link from "next/link";

export const metadata = {
    title: "Next.js React SSR",
};

export default function Home() {
    return (
        <>
            <GovHeader />
            <GovContainer>
                <main className="govuk-main-wrapper" id="main-content" role="main">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds">
                            <h1 className="govuk-heading-xl">
                                Next.js React SSR
                            </h1>
                            <GovParagraph>
                                Welcome to the NestJS GOV.UK Frontend application,
                                this is the homepage of the application with links to
                                all the components from the latest version of GOV.UK
                                Frontend.
                            </GovParagraph>
                            <div className="govuk-panel govuk-panel--confirmation">
                                <h1 className="govuk-panel__title">
                                    Try our new journey
                                </h1>
                                <div className="govuk-panel__body">
                                    Find a Court or Tribunal Service
                                </div>
                            </div>
                            <div className="govuk-button-group govuk-!-margin-top-4">
                                <Link
                                    href="/find-a-court-or-tribunal"
                                    role="button"
                                    draggable="false"
                                    className="govuk-button govuk-button--start"
                                    data-module="govuk-button"
                                    data-govuk-button-init=""
                                >
                                    Start
                                    <svg
                                        className="govuk-button__start-icon"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="17.5"
                                        height="19"
                                        viewBox="0 0 33 40"
                                        aria-hidden="true"
                                        focusable="false"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M0 0h13l20 20-20 20H0l20-20z"
                                        />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </GovContainer>
        </>
    );
}

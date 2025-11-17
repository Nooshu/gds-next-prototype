import GovHeader from "@/components/govuk/GovHeader";
import GovContainer from "@/components/govuk/GovContainer";
import { GovParagraph } from "@/components/govuk/GovParagraph";
import Link from "next/link";

export const metadata = {
    title: "Find a court or tribunal",
};

export default function FindACourtPage() {
    return (
        <>
            <GovHeader />
            <GovContainer>
                <main className="govuk-main-wrapper" id="main-content" role="main">
                    <h1 className="govuk-heading-xl govuk-!-margin-top-6">
                        Find a court or tribunal
                    </h1>

                    <GovParagraph>
                        Use this service to find a court or tribunal in England and
                        Wales.
                    </GovParagraph>

                    <ul className="govuk-list govuk-list--bullet">
                        <li>address</li>
                        <li>contact details</li>
                        <li>opening times</li>
                        <li>
                            building information e.g. disabled access or parking
                        </li>
                        <li>to help me get an update</li>
                    </ul>

                    <Link
                        href="/find-a-court-or-tribunal-backup"
                        role="button"
                        draggable="false"
                        className="govuk-button govuk-!-margin-top-4 govuk-button--start"
                        data-module="govuk-button"
                        data-govuk-button-init=""
                    >
                        Start journey
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

                    <h2 className="govuk-heading-m govuk-!-margin-top-4">
                        Before you search
                    </h2>

                    <div className="govuk-inset-text">
                        The online service is also available in Welsh (Cymraeg).
                    </div>

                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds">
                            <GovParagraph>
                                You cannot use this service if you live in Northern
                                Ireland. Contact the{" "}
                                <a
                                    className="govuk-link"
                                    href="https://www.justice-ni.gov.uk/topics/courts-and-tribunals"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Northern Ireland Courts and Tribunals (opens in new
                                    tab)
                                </a>{" "}
                                for help.
                            </GovParagraph>
                            <GovParagraph>
                                You cannot use this service to pay court fees.
                            </GovParagraph>
                            <GovParagraph>
                                This service is limited in Scotland to:
                            </GovParagraph>

                            <ul className="govuk-list govuk-list--bullet">
                                <li>Immigration appeals</li>
                                <li>Benefit appeals</li>
                                <li>Employment claims appeals</li>
                            </ul>

                            <GovParagraph>
                                Contact the{" "}
                                <a
                                    className="govuk-link"
                                    href="https://www.scotcourts.gov.uk/the-courts/the-tribunals"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Scottish Courts and Tribunals (opens in new tab)
                                </a>{" "}
                                for other services.
                            </GovParagraph>
                        </div>
                    </div>

                    <form
                        method="POST"
                        action="/find-a-court-or-tribunal/name-search"
                        noValidate
                        id="nameSearchForm"
                        role="search"
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
                                aria-label="Search for a court or tribunal by name, address, town or city"
                            />
                        </div>
                    </form>

                    <div className="govuk-grid-row">
                        <div
                            className="govuk-grid-column-two-thirds"
                            id="courtResults"
                            style={{ display: "none" }}
                            role="region"
                            aria-live="polite"
                            aria-label="Search results"
                        >
                            <ul
                                className="govuk-list"
                                aria-label="List of courts and tribunals matching your search"
                            >
                                {/* ... */}
                            </ul>
                        </div>
                    </div>
                </main>
            </GovContainer>
        </>
    );
}

import GovHeader from "@/components/govuk/GovHeader";
import GovContainer from "@/components/govuk/GovContainer";
import { GovH2 } from "@/components/govuk/GovHeading";
import { GovParagraph } from "@/components/govuk/GovParagraph";
import Link from "next/link";

export const metadata = {
    title: "Find a court or tribunal",
};

export default function FindACourtOptionsPage() {
    return (
        <>
            <GovHeader />
            <GovContainer>
                <main className="govuk-main-wrapper" id="main-content" role="main">
                    <GovH2 className="govuk-!-margin-top-6" id="court-name-question">
                        Do you know the name of the court or tribunal
                    </GovH2>

                    <GovParagraph id="court-name-hint">
                        The name of the court or tribunal can be found on a letter,
                        email or text from us.
                    </GovParagraph>

                    <form
                        method="POST"
                        action="/find-a-court-or-tribunal/options"
                        noValidate
                        id="optionsForm"
                        aria-labelledby="court-name-question"
                    >
                        <div className="govuk-form-group">
                            <fieldset className="govuk-fieldset">
                                <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                                    Choose one of the following options:
                                </legend>
                                <div
                                    className="govuk-radios"
                                    data-module="govuk-radios"
                                    data-govuk-radios-init=""
                                >
                                    <div className="govuk-radios__item">
                                        <input
                                            className="govuk-radios__input"
                                            id="courtOption"
                                            name="courtOption"
                                            type="radio"
                                            value="option1"
                                        />
                                        <label
                                            className="govuk-label govuk-radios__label"
                                            htmlFor="courtOption"
                                        >
                                            I have the name
                                        </label>
                                    </div>
                                    <div className="govuk-radios__item">
                                        <input
                                            className="govuk-radios__input"
                                            id="courtOption-2"
                                            name="courtOption"
                                            type="radio"
                                            value="option2"
                                        />
                                        <label
                                            className="govuk-label govuk-radios__label"
                                            htmlFor="courtOption-2"
                                        >
                                            I do not have the name
                                        </label>
                                    </div>
                                </div>
                            </fieldset>
                        </div>

                        <Link
                            href="/find-a-court-or-tribunal-search"
                            role="button"
                            draggable="false"
                            className="govuk-button"
                            data-module="govuk-button"
                            id="submit-button"
                            data-govuk-button-init=""
                        >
                            Continue
                        </Link>
                    </form>
                </main>
            </GovContainer>
        </>
    );
}

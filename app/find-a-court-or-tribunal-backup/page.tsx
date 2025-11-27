"use client";

import { useState } from "react";
import GovHeader from "@/components/govuk/GovHeader";
import GovContainer from "@/components/govuk/GovContainer";
import { GovH2 } from "@/components/govuk/GovHeading";
import { GovParagraph } from "@/components/govuk/GovParagraph";
import { GovRadios, RadioOption } from "@/components/govuk/GovRadios";
import GovErrorSummary from "@/components/govuk/GovErrorSummary";
import { GovButton } from "@/components/govuk/GovButton";
import { useRouter } from "next/navigation";
import FocusOnRender from "@/components/a11y/FocusOnRender";

const radioOptions: RadioOption[] = [
    {
        value: "option1",
        label: "I have the name",
    },
    {
        value: "option2", 
        label: "I do not have the name",
    },
];

export default function FindACourtOptionsPage() {
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [showError, setShowError] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedOption) {
            setError("Select whether you know the name of the court or tribunal");
            setShowError(true);
            return;
        }

        setError("");
        setShowError(false);
        
        // Navigate based on selection
        if (selectedOption === "option1") {
            router.push("/find-a-court-or-tribunal-search");
        } else {
            router.push("/find-a-court-or-tribunal-search");
        }
    };

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
                                    <a href="#courtOption">
                                        Select whether you know the name of the court or tribunal
                                    </a>
                                </li>
                            </GovErrorSummary>
                        </>
                    )}

                    <GovH2 className="govuk-!-margin-top-6" id="court-name-question">
                        Do you know the name of the court or tribunal
                    </GovH2>

                    <GovParagraph id="court-name-hint">
                        The name of the court or tribunal can be found on a letter,
                        email or text from us.
                    </GovParagraph>

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        id="optionsForm"
                        aria-labelledby="court-name-question"
                    >
                        <GovRadios
                            name="courtOption"
                            id="courtOption"
                            legend="Choose one of the following options:"
                            legendSize="m"
                            options={radioOptions}
                            value={selectedOption}
                            onChange={setSelectedOption}
                            error={showError ? error : undefined}
                            required
                        />

                        <GovButton type="submit" id="submit-button">
                            Continue
                        </GovButton>
                    </form>
                </main>
            </GovContainer>
        </>
    );
}

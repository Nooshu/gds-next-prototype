"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GovHeader from "@/components/govuk/GovHeader";
import GovContainer from "@/components/govuk/GovContainer";
import { GovH2 } from "@/components/govuk/GovHeading";
import { GovParagraph } from "@/components/govuk/GovParagraph";
import { GovRadios, RadioOption } from "@/components/govuk/GovRadios";
import GovErrorSummary from "@/components/govuk/GovErrorSummary";
import { GovButton } from "@/components/govuk/GovButton";
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

function FindACourtOptionsForm() {
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [showError, setShowError] = useState<boolean>(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Check for error in URL params (from server-side validation)
    // Only runs on client-side when JS is enabled
    useEffect(() => {
        if (typeof window === "undefined") return;
        
        const errorParam = searchParams.get("error");
        if (errorParam) {
            setError(errorParam);
            setShowError(true);
            // Clean up URL by removing error param (optional, for better UX)
            const newUrl = window.location.pathname;
            window.history.replaceState({}, "", newUrl);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedOption) {
            setError("Select whether you know the name of the court or tribunal");
            setShowError(true);
            return;
        }

        setError("");
        setShowError(false);
        
        try {
            // Navigate based on selection
            if (selectedOption === "option1") {
                await router.push("/find-a-court-or-tribunal-search");
            } else {
                await router.push("/find-a-court-or-tribunal-search");
            }
        } catch (error) {
            // Handle navigation errors gracefully
            console.error("Navigation error:", error);
            // Optionally show an error message to the user
            setError("An error occurred while navigating. Please try again.");
            setShowError(true);
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
                        action="/api/court-option"
                        method="POST"
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

export default function FindACourtOptionsPage() {
    return (
        <Suspense fallback={
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
                            action="/api/court-option"
                            method="POST"
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
                                required
                            />
                            <GovButton type="submit" id="submit-button">
                                Continue
                            </GovButton>
                        </form>
                    </main>
                </GovContainer>
            </>
        }>
            <FindACourtOptionsForm />
        </Suspense>
    );
}

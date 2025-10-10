interface GovErrorSummaryProps {
    title?: string;
    children: React.ReactNode;
}

export default function GovErrorSummary({
    title = "There is a problem",
    children,
}: GovErrorSummaryProps) {
    return (
        <div
            className="govuk-error-summary"
            role="alert"
            aria-labelledby="error-summary-title"
        >
            <h2 className="govuk-error-summary__title" id="error-summary-title">
                {title}
            </h2>
            <div className="govuk-error-summary__body">
                <ul className="govuk-list govuk-error-summary__list">
                    {children}
                </ul>
            </div>
        </div>
    );
}

import React from "react";

interface GovFieldErrorProps {
    id: string;
    children: React.ReactNode;
}

export const GovFieldError: React.FC<GovFieldErrorProps> = ({ id, children }) => {
    return (
        <p id={id} className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span>
            {children}
        </p>
    );
};

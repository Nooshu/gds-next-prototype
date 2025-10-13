import React from "react";

interface GovInputProps {
    id?: string;
    name: string;
    type?: string;
    value?: string;
    placeholder?: string;
    className?: string;
    hint?: string;
    error?: string;
    describedBy?: string;
    required?: boolean;
    disabled?: boolean;
    autoComplete?: string;
}

export const GovInput: React.FC<GovInputProps> = ({
    id,
    name,
    type = "text",
    value,
    placeholder,
    className = "",
    hint,
    error,
    describedBy,
    required = false,
    disabled = false,
    autoComplete,
}) => {
    const inputId = id || name;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    const describedByIds = [hintId, errorId, describedBy]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            className={`govuk-form-group ${
                error ? "govuk-form-group--error" : ""
            }`}
        >
            {hint && (
                <div id={hintId} className="govuk-hint">
                    {hint}
                </div>
            )}
            {error && (
                <p id={errorId} className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>
                    {error}
                </p>
            )}
            <input
                id={inputId}
                name={name}
                type={type}
                value={value}
                placeholder={placeholder}
                className={`govuk-input ${
                    error ? "govuk-input--error" : ""
                } ${className}`.trim()}
                aria-describedby={describedByIds || undefined}
                required={required}
                disabled={disabled}
                autoComplete={autoComplete}
            />
        </div>
    );
};

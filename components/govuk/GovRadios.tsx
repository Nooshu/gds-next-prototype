import React from "react";

export interface RadioOption {
    value: string;
    label: string;
    hint?: string;
    disabled?: boolean;
}

interface GovRadiosProps {
    name: string;
    legend: string;
    legendSize?: "s" | "m" | "l" | "xl";
    hint?: string;
    error?: string;
    options: RadioOption[];
    value?: string;
    onChange?: (value: string) => void;
    required?: boolean;
    className?: string;
    id?: string;
}

export const GovRadios: React.FC<GovRadiosProps> = ({
    name,
    legend,
    legendSize = "m",
    hint,
    error,
    options,
    value,
    onChange,
    required = false,
    className = "",
    id,
}) => {
    const fieldsetId = id || name;
    const hintId = hint ? `${fieldsetId}-hint` : undefined;
    const errorId = error ? `${fieldsetId}-error` : undefined;

    const describedByIds = [hintId, errorId].filter(Boolean).join(" ");

    return (
        <div
            className={`govuk-form-group ${
                error ? "govuk-form-group--error" : ""
            } ${className}`.trim()}
        >
            <fieldset
                className="govuk-fieldset"
                aria-describedby={describedByIds || undefined}
                id={fieldsetId}
            >
                <legend
                    className={`govuk-fieldset__legend govuk-fieldset__legend--${legendSize}`}
                >
                    {legend}
                </legend>
                
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
                
                <div
                    className="govuk-radios"
                    data-module="govuk-radios"
                    data-govuk-radios-init=""
                >
                    {options.map((option, index) => {
                        const optionId = `${name}-${index + 1}`;
                        const optionHintId = option.hint ? `${optionId}-hint` : undefined;
                        
                        return (
                            <div key={option.value} className="govuk-radios__item">
                                <input
                                    className="govuk-radios__input"
                                    id={optionId}
                                    name={name}
                                    type="radio"
                                    value={option.value}
                                    checked={value === option.value}
                                    onChange={(e) => onChange?.(e.target.value)}
                                    required={required}
                                    disabled={option.disabled}
                                    aria-describedby={optionHintId}
                                />
                                <label
                                    className="govuk-label govuk-radios__label"
                                    htmlFor={optionId}
                                >
                                    {option.label}
                                </label>
                                {option.hint && (
                                    <div
                                        id={optionHintId}
                                        className="govuk-hint govuk-radios__hint"
                                    >
                                        {option.hint}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </fieldset>
        </div>
    );
};



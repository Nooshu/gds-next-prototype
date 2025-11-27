import React from "react";

interface GovFormProps {
    children: React.ReactNode;
    action?: string;
    method?: string;
    className?: string;
    onSubmit?: (_e: React.FormEvent<HTMLFormElement>) => void;
}

export const GovForm: React.FC<GovFormProps> = ({
    children,
    action,
    method = "POST",
    className = "",
    onSubmit,
}) => {
    return (
        <form
            className={`govuk-form ${className}`.trim()}
            action={action}
            method={method}
            onSubmit={onSubmit}
        >
            {children}
        </form>
    );
};

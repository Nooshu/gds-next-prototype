import React from "react";

interface GovButtonProps {
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "warning";
    className?: string;
    disabled?: boolean;
    onClick?: (_e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const GovButton: React.FC<GovButtonProps> = ({
    children,
    type = "submit",
    variant = "primary",
    className = "",
    disabled = false,
    onClick,
}) => {
    const baseClass =
        variant === "primary"
            ? "govuk-button"
            : variant === "secondary"
            ? "govuk-button govuk-button--secondary"
            : "govuk-button govuk-button--warning";

    return (
        <button
            type={type}
            className={`${baseClass} ${className}`.trim()}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

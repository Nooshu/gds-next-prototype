import React from "react";

interface GovParagraphProps {
    children: React.ReactNode;
    className?: string;
    size?: "s" | "m" | "l" | "xl";
}

export const GovParagraph: React.FC<GovParagraphProps> = ({
    children,
    className = "",
    size = "m",
}) => {
    const sizeClass = size !== "m" ? `govuk-body-${size}` : "govuk-body";

    return <p className={`${sizeClass} ${className}`.trim()}>{children}</p>;
};

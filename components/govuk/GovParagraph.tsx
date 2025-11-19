import React from "react";

interface GovParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
    className?: string;
    size?: "s" | "m" | "l" | "xl";
}

export const GovParagraph: React.FC<GovParagraphProps> = ({
    children,
    className = "",
    size = "m",
    ...props
}) => {
    const sizeClass = size !== "m" ? `govuk-body-${size}` : "govuk-body";

    return (
        <p className={`${sizeClass} ${className}`.trim()} {...props}>
            {children}
        </p>
    );
};

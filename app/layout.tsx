import "./styles/global.scss";
import type { Metadata } from "next";
import Script from "next/script";
import { GovFooter } from "@/components/govuk/GovFooter";

export const metadata: Metadata = {
    title: {
        default: "HMCTS Courts Prototype",
        template: "%s – HMCTS Courts Prototype",
    },
    description:
        "Prototype of FaCT screens using Next.js SSR and GOV.UK Frontend",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="govuk-template">
            <body className="govuk-template__body">
                <a className="govuk-skip-link" href="#main-content">
                    Skip to main content
                </a>
                {children}
                <GovFooter />
                <Script src="/govuk-frontend.js" />
            </body>
        </html>
    );
}

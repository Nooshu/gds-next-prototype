import React from "react";

interface GovFooterProps {
    children?: React.ReactNode;
    className?: string;
}

export const GovFooter: React.FC<GovFooterProps> = ({
    children,
    className = "",
}) => {
    return (
        <footer
            className={`govuk-footer ${className}`.trim()}
            role="contentinfo"
        >
            <div className="govuk-width-container">
                {children || (
                    <div className="govuk-footer__meta">
                        <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
                            <h2 className="govuk-visually-hidden">
                                Support links
                            </h2>
                            <ul className="govuk-footer__inline-list">
                                <li className="govuk-footer__inline-list-item">
                                    <a className="govuk-footer__link" href="#">
                                        Help
                                    </a>
                                </li>
                                <li className="govuk-footer__inline-list-item">
                                    <a className="govuk-footer__link" href="#">
                                        Cookies
                                    </a>
                                </li>
                                <li className="govuk-footer__inline-list-item">
                                    <a className="govuk-footer__link" href="#">
                                        Contact
                                    </a>
                                </li>
                                <li className="govuk-footer__inline-list-item">
                                    <a className="govuk-footer__link" href="#">
                                        Terms and conditions
                                    </a>
                                </li>
                                <li className="govuk-footer__inline-list-item">
                                    <a className="govuk-footer__link" href="#">
                                        Accessibility statement
                                    </a>
                                </li>
                            </ul>
                            <svg
                                aria-hidden="true"
                                focusable="false"
                                className="govuk-footer__licence-logo"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 483.2 195.7"
                                height="17"
                                width="41"
                            >
                                <path
                                    fill="currentColor"
                                    d="M421.5 142.8V.1l-50.7 32.3v161.1h112.4v-50.7zm-122.3-9.6A47.12 47.12 0 0 1 221 97.58c0-26 21.1-47.11 47.1-47.11a47.12 47.12 0 0 1 47.1 47.11c0 26-21.1 47.11-47.1 47.11z"
                                />
                            </svg>
                            <span className="govuk-footer__licence-description">
                                All content is available under the{" "}
                                <a
                                    className="govuk-footer__link"
                                    href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                                    rel="license"
                                >
                                    Open Government Licence v3.0
                                </a>
                                , except where otherwise stated
                            </span>
                        </div>
                        <div className="govuk-footer__meta-item">
                            <a
                                className="govuk-footer__link govuk-footer__link--support"
                                href="https://www.gov.uk/contact"
                            >
                                Contact HMCTS
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </footer>
    );
};

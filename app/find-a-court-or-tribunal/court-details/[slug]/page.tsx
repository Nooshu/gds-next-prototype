"use client";

import { useEffect, useState } from "react";
import React from "react";
import GovHeader from "@/components/govuk/GovHeader";
import GovContainer from "@/components/govuk/GovContainer";
import { GovH2, GovH3 } from "@/components/govuk/GovHeading";
import { GovParagraph } from "@/components/govuk/GovParagraph";
import { GovFooter } from "@/components/govuk/GovFooter";
import Link from "next/link";

interface CourtDetailsPageProps {
    params: Promise<{
        slug: string;
    }>;
}

interface CourtData {
    name: string;
    image: string;
    imageAlt: string;
    address: {
        line1: string;
        line2: string;
        line3: string;
        postcode: string;
    };
    mapsUrl: string;
    openingTimes: {
        courtOpen?: string;
        counterOpen: string;
        telephoneEnquiries?: string;
    };
    emails: Array<{
        key: string;
        value: string;
        href: string;
        note?: string;
    }>;
    telephones: Array<{
        key: string;
        value: string;
    }>;
    disabilityContact: string;
    facilities: Array<{
        key: string;
        value: string | React.ReactNode;
    }>;
    locationHandles: string[];
    locationHandlesLinks?: Array<{
        text: string;
        href: string;
    }>;
    courtCode: string;
    dx: string;
}

const courtsData: Record<string, CourtData> = {
    "manchester-crown": {
        name: "Manchester Crown Court (Minshull St)",
        image: "/assets/images/courtImages/manchester-crown-court.jpg",
        imageAlt: "Manchester Crown Court (Minshull St) exterior",
        address: {
            line1: "The Court House",
            line2: "Aytoun Street",
            line3: "Manchester",
            postcode: "M1 3FS",
        },
        mapsUrl: "https://www.google.com/maps?q=53.4809021085643,-2.25267283736438",
        openingTimes: {
            courtOpen: "Monday to Friday 7:30am to 5pm",
            counterOpen: "Monday to Friday 9am to 5pm",
            telephoneEnquiries: "Monday to Friday 8am to 5pm",
        },
        emails: [
            {
                key: "Enquiries",
                value: "Accommodation.manchesterminshullstreet.crowncourt@justice.gov.uk",
                href: "mailto:Accommodation.manchesterminshullstreet.crowncourt@justice.gov.uk",
                note: "(Accommodation)",
            },
            {
                key: "Enquiries",
                value: "courtclerks.manchesterminshullstreet.crowncourt@justice.gov.uk",
                href: "mailto:courtclerks.manchesterminshullstreet.crowncourt@justice.gov.uk",
                note: "(Court Clerks)",
            },
            {
                key: "Crown court",
                value: "crownoffice.manchesterminshullstreet.crowncourt@justice.gov.uk",
                href: "mailto:crownoffice.manchesterminshullstreet.crowncourt@justice.gov.uk",
            },
            {
                key: "Listings",
                value: "listing.manchesterminshullstreet.crowncourt@justice.gov.uk",
                href: "mailto:listing.manchesterminshullstreet.crowncourt@justice.gov.uk",
            },
        ],
        telephones: [
            { key: "Enquiries", value: "0161 954 7500" },
            { key: "Witness service", value: "0300 332 1000" },
        ],
        disabilityContact: "0161 954 7500",
        facilities: [
            {
                key: "No parking",
                value:
                    "There are no parking facilities at this building, however public car parks are available nearby on Major Street, Bloom Street and Aurburn Street.",
            },
            {
                key: "Disabled access",
                value: (
                    <>
                        This is a grade 2* listed building and therefore access may be
                        restricted, There is no access for wheelchair users to courtrooms
                        5, 6, 7 &amp; 8. Access is restricted to the well of the Court for
                        wheelchair users in courtrooms 1, 2, 3, 4, 9 &amp; 10. Please
                        contact us to discuss this on{" "}
                        <a
                            className="govuk-link"
                            href="mailto:Accommodation.manchesterminshullstreet.crowncourt@justice.gov.uk"
                        >
                            Accommodation.manchesterminshullstreet.crowncourt@justice.gov.uk
                        </a>{" "}
                        or on 0161 954 7545. We do have a lift at the entrance and level
                        access to most areas and some Courtrooms. We also have a lift to
                        the first and second floors.
                    </>
                ),
            },
            {
                key: "Hidden Disabilities Sunflower network",
                value: "Lanyards available on request.",
            },
            {
                key: "Assistance dogs",
                value: "Assistance dogs are welcome.",
            },
            {
                key: "Hearing Loop",
                value:
                    "The building has hearing enhancement facilities available in all courtroom",
            },
            {
                key: "Security arch",
                value:
                    "For safety and security all users and their possessions will be searched by security when they enter this building. This court has a security arch. Please alert a security officer if you have a pacemaker.",
            },
            {
                key: "Lift",
                value:
                    "Lifts are available in this building to access the first and second floors. For those requiring wheelchair access, the width of the doors is 32 inches and the weight restriction is 630kg.",
            },
            {
                key: "Public toilets",
                value: "Public toilets are available on the ground floor.",
            },
            {
                key: "Disabled toilet",
                value: "An accessible toilet is available on the ground floor.",
            },
            {
                key: "Refreshments",
                value: "Chilled water is available on the first floor.",
            },
            {
                key: "Interview room",
                value:
                    "There are eleven interview/consultation rooms available in the building, located on the ground, first and second floors. It may be possible to book some of these in advance. Please contact us on 0161 954 7577.",
            },
            {
                key: "Waiting Room",
                value:
                    "This building has a public waiting area outside courtrooms on the ground floor, first floor and second floor. There is a seperate waiting area for witnesses. Please ask for details.",
            },
            {
                key: "Baby changing facility",
                value:
                    "Baby changing facilities are located in the disabled toilet on the ground floor.",
            },
            {
                key: "Video facilities",
                value: (
                    <>
                        Court/hearing room video conferencing facilities and prison to
                        court video link facilities are available (by prior arrangement).
                        For queries please contact{" "}
                        <a
                            className="govuk-link"
                            href="mailto:listing.manchesterminshullstreet.crowncourt@justice.gov.uk"
                        >
                            listing.manchesterminshullstreet.crowncourt@justice.gov.uk
                        </a>{" "}
                        or 0161 954 7500.
                    </>
                ),
            },
            {
                key: "Wireless network connection",
                value:
                    "Wi-Fi is available in all areas of the building and can be accessed via PCU or GOV Wi-Fi.",
            },
        ],
        locationHandles: ["Crime", "Single justice procedure"],
        locationHandlesLinks: [
            {
                text: "Domestic Abuse Protection Order (DAPOs)",
                href: "https://www.gov.uk/guidance/domestic-abuse-protection-notices-dapns-and-domestic-abuse-protection-orders-dapos",
            },
        ],
        courtCode: "436",
        dx: "724860 Manchester 43",
    },
    "birmingham-crown": {
        name: "Birmingham Crown Court",
        image: "/assets/images/courtImages/birmingham-crown-court.jpg",
        imageAlt: "Birmingham Crown Court exterior",
        address: {
            line1: "Queen Elizabeth II Law Courts",
            line2: "1 Newton Street",
            line3: "Birmingham",
            postcode: "B4 7NA",
        },
        mapsUrl: "https://maps.google.com/maps?q=52.482795,-1.8925",
        openingTimes: {
            courtOpen: "9am to 5pm",
            counterOpen: "9am to 5pm",
        },
        emails: [
            {
                key: "Enquiries",
                value: "enquiries.birmingham.crowncourt@justice.gov.uk",
                href: "mailto:enquiries.birmingham.crowncourt@justice.gov.uk",
            },
        ],
        telephones: [
            { key: "Enquiries", value: "0121 681 3300" },
            { key: "Witness service", value: "0300 332 1000" },
        ],
        disabilityContact: "0121 681 3300",
        facilities: [
            {
                key: "Hidden Disabilities Sunflower network",
                value: "Lanyards available on request.",
            },
            {
                key: "Assistance dogs",
                value: "Assistance dogs are welcome.",
            },
            {
                key: "Hearing Loop",
                value:
                    "Hearing facilities are fixed in some Courtrooms and mobile units available for use in others.",
            },
            {
                key: "Refreshments",
                value:
                    "Catering facilities are currently closed so there are no refreshments available on site",
            },
            {
                key: "Interview room",
                value: "Fifteen interview rooms are available at this court.",
            },
            {
                key: "Wireless network connection",
                value: "Access to GovWifi available.",
            },
        ],
        locationHandles: ["Crime", "Single justice procedure"],
        courtCode: "404",
        dx: "702033 Birmingham 8",
    },
    "london-crown": {
        name: "Inner London Crown Court",
        image: "/assets/images/courtImages/inner_london_crown_court.jpg",
        imageAlt: "Inner London Crown Court exterior",
        address: {
            line1: "Sessions House",
            line2: "Newington Causeway",
            line3: "London",
            postcode: "SE1 6AZ",
        },
        mapsUrl: "https://maps.google.com/maps?q=51.4981827741503,-0.0965350924886508",
        openingTimes: {
            courtOpen: "Monday to Friday 8am to 5pm",
            counterOpen: "9am to 5pm",
        },
        emails: [
            {
                key: "Enquiries",
                value: "innerlondoncrowncourt@justice.gov.uk",
                href: "mailto:innerlondoncrowncourt@justice.gov.uk",
            },
            {
                key: "Citizens advice",
                value: "innerlondon.cc@citizensadvice.org.uk",
                href: "mailto:innerlondon.cc@citizensadvice.org.uk",
            },
        ],
        telephones: [
            { key: "Enquiries", value: "020 7234 3100" },
            { key: "Fax", value: "0870 324 0226" },
            { key: "Witness service", value: "030 0332 1232" },
        ],
        disabilityContact: "020 7234 3100",
        facilities: [
            {
                key: "Disabled access",
                value: "Disabled access and disabled toilet",
            },
            {
                key: "Hidden Disabilities Sunflower network",
                value: "Lanyards available on request.",
            },
            {
                key: "Assistance dogs",
                value: "Assistance dogs are welcome.",
            },
            {
                key: "Hearing Loop",
                value: "This court has hearing enhancement facilities.",
            },
            {
                key: "Refreshments",
                value: "Vending machines are available at this court.",
            },
            {
                key: "Interview room",
                value: "Seven interview rooms are available at this court.",
            },
            {
                key: "Prayer / Quiet room",
                value: "This court has a prayer room.",
            },
            {
                key: "Video facilities",
                value: "Video conference and Prison Video Link facilities.",
            },
            {
                key: "Wireless network connection",
                value:
                    "This court has wireless internet access available within the building.",
            },
        ],
        locationHandles: ["Crime", "Single justice procedure"],
        courtCode: "440",
        dx: "97345 Southwark 3",
    },
};

export default function CourtDetailsPage({ params }: CourtDetailsPageProps) {
    const [_slug, setSlug] = useState<string>("");
    const [courtData, setCourtData] = useState<CourtData | null>(null);

    useEffect(() => {
        // Add js-enabled and govuk-frontend-supported classes
        document.body.className = document.body.className
            ? `${document.body.className} js-enabled govuk-frontend-supported`
            : "js-enabled govuk-frontend-supported";

        // Resolve params promise
        params.then((resolvedParams) => {
            setSlug(resolvedParams.slug);
            setCourtData(courtsData[resolvedParams.slug] || null);
        });
    }, [params]);

    if (!courtData) {
        return (
            <>
                <GovHeader />
                <GovContainer>
                    <main className="govuk-main-wrapper" id="main-content" role="main">
                        <GovH2>Court not found</GovH2>
                        <GovParagraph>
                            The court you&apos;re looking for could not be found.
                        </GovParagraph>
                    </main>
                </GovContainer>
            </>
        );
    }

    return (
        <>
            <GovHeader />
            <GovContainer>
                <main className="govuk-main-wrapper" id="main-content" role="main">
                    <GovH2>{courtData.name}</GovH2>

                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds">
                            <GovH3>Visit or contact us:</GovH3>
                            <GovH3 className="govuk-heading-m">Address</GovH3>
                            <ul className="govuk-list">
                                <li className="govuk-body govuk-!-margin-bottom-0">
                                    {courtData.address.line1}
                                </li>
                                <li className="govuk-body govuk-!-margin-bottom-0">
                                    {courtData.address.line2}
                                </li>
                                <li className="govuk-body govuk-!-margin-bottom-0">
                                    {courtData.address.line3}
                                </li>
                                <li className="govuk-body govuk-!-margin-bottom-0">
                                    {courtData.address.postcode}
                                </li>
                            </ul>
                            <ul className="govuk-list">
                                <li>
                                    <a
                                        className="govuk-link"
                                        href={courtData.mapsUrl}
                                        rel="noopener noreferrer"
                                        aria-label="Get directions (opens in new tab)"
                                        target="_blank"
                                    >
                                        Get directions (opens in new tab)
                                    </a>
                                </li>
                                <li className="govuk-!-margin-top-4">
                                    <a
                                        className="govuk-link"
                                        href="https://www.gov.uk/guidance/what-to-expect-coming-to-a-court-or-tribunal"
                                        rel="noopener noreferrer"
                                        aria-label="What to expect coming to a court or tribunal (opens in new tab)"
                                        target="_blank"
                                    >
                                        What to expect coming to a court or tribunal (opens
                                        in new tab)
                                    </a>
                                </li>
                            </ul>

                            <GovH3 className="govuk-heading-m">
                                Additional information
                            </GovH3>
                            <GovParagraph className="govuk-!-margin-bottom-0">
                                <a
                                    className="govuk-link"
                                    href="https://www.gov.uk/government/news/scammers-using-hmcts-telephone-numbers"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Scammers are mimicking genuine HMCTS phone numbers and email addresses (opens in new tab)"
                                >
                                    Scammers are mimicking genuine HMCTS phone numbers and
                                    email addresses
                                </a>
                                . They may demand payment and claim to be from HMRC or
                                enforcement. If you&apos;re unsure, do not pay anything
                                and report the scam to{" "}
                                <a
                                    className="govuk-link"
                                    href="https://www.actionfraud.police.uk/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Action Fraud (opens in new tab)"
                                >
                                    Action Fraud
                                </a>
                                .
                            </GovParagraph>

                            <GovH3 className="govuk-heading-m govuk-!-margin-top-4">
                                Opening times
                            </GovH3>
                            <dl className="govuk-summary-list">
                                {courtData.openingTimes.courtOpen && (
                                    <div className="govuk-summary-list__row">
                                        <dt className="govuk-summary-list__key">
                                            Court open
                                        </dt>
                                        <dd className="govuk-summary-list__value">
                                            {courtData.openingTimes.courtOpen}
                                        </dd>
                                    </div>
                                )}
                                <div className="govuk-summary-list__row">
                                    <dt className="govuk-summary-list__key">
                                        Counter open
                                    </dt>
                                    <dd className="govuk-summary-list__value">
                                        {courtData.openingTimes.counterOpen}
                                    </dd>
                                </div>
                                {courtData.openingTimes.telephoneEnquiries && (
                                    <div className="govuk-summary-list__row">
                                        <dt className="govuk-summary-list__key">
                                            Telephone enquiries answered
                                        </dt>
                                        <dd className="govuk-summary-list__value">
                                            {courtData.openingTimes.telephoneEnquiries}
                                        </dd>
                                    </div>
                                )}
                            </dl>

                            <GovH3 className="govuk-heading-m govuk-!-margin-top-4">
                                Email
                            </GovH3>
                            <dl className="govuk-summary-list">
                                {courtData.emails.map((email, index) => (
                                    <div key={index} className="govuk-summary-list__row">
                                        <dt className="govuk-summary-list__key">
                                            {email.key}
                                        </dt>
                                        <dd className="govuk-summary-list__value">
                                            <a className="govuk-link" href={email.href}>
                                                {email.value}
                                            </a>
                                            {email.note && ` ${email.note}`}
                                        </dd>
                                    </div>
                                ))}
                            </dl>

                            <GovH3 className="govuk-heading-m govuk-!-margin-top-4">
                                Telephone
                            </GovH3>
                            <dl className="govuk-summary-list">
                                {courtData.telephones.map((phone, index) => (
                                    <div key={index} className="govuk-summary-list__row">
                                        <dt className="govuk-summary-list__key">
                                            {phone.key}
                                        </dt>
                                        <dd className="govuk-summary-list__value">
                                            {phone.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>

                            <GovH3 className="govuk-heading-m govuk-!-margin-top-4">
                                Building facilities
                            </GovH3>
                            <GovParagraph>
                                If you have a disability and need help coming to a
                                hearing, please contact {courtData.disabilityContact}.
                            </GovParagraph>

                            <dl className="govuk-summary-list">
                                {courtData.facilities.map((facility, index) => (
                                    <div key={index} className="govuk-summary-list__row">
                                        <dt className="govuk-summary-list__key">
                                            {facility.key}
                                        </dt>
                                        <dd className="govuk-summary-list__value">
                                            {facility.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>

                            <GovH2 className="govuk-heading-s">
                                Translators or Interpreters
                            </GovH2>
                            <GovParagraph>
                                <a
                                    className="govuk-link"
                                    href="https://www.gov.uk/get-interpreter-at-court-or-tribunal"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Get an interpreter at a court or tribunal (opens in new tab)"
                                >
                                    Get an interpreter at a court or tribunal. (opens in
                                    new tab)
                                </a>
                            </GovParagraph>
                        </div>

                        <div className="govuk-grid-column-one-third">
                            <div className="govuk-grid-row govuk-!-padding-left-3">
                                {courtData.image && (
                                    <img
                                        src={courtData.image}
                                        alt={courtData.imageAlt}
                                        role="img"
                                        className="govuk-!-width-full"
                                        style={{
                                            width: "100%",
                                            maxHeight: "400px",
                                            objectFit: "contain",
                                        }}
                                    />
                                )}
                                <GovParagraph className="govuk-body-s">
                                    {courtData.name}
                                </GovParagraph>
                            </div>

                            <GovH3 className="govuk-heading-m">
                                This location handles
                            </GovH3>
                            {courtData.locationHandles.map((handle, index) => (
                                <GovParagraph key={index}>{handle}</GovParagraph>
                            ))}
                            {courtData.locationHandlesLinks?.map((link, index) => (
                                <GovParagraph key={index}>
                                    <a className="govuk-link" href={link.href}>
                                        {link.text}
                                    </a>
                                </GovParagraph>
                            ))}

                            <GovH3 className="govuk-heading-m govuk-!-margin-top-4">
                                Make a complaint
                            </GovH3>
                            <GovParagraph className="govuk-!-margin-bottom-4">
                                <a
                                    className="govuk-link"
                                    href="https://www.gov.uk/government/organisations/hm-courts-and-tribunals-service/about/complaints-procedure"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Contact us to make a complaint (opens in new tab)"
                                >
                                    Contact us to make a complaint
                                </a>
                            </GovParagraph>

                            <GovH3 className="govuk-heading-m govuk-!-margin-top-4">
                                Court codes for legal professionals
                            </GovH3>
                            <GovParagraph>
                                Crown Court location code: {courtData.courtCode}
                            </GovParagraph>
                            <GovParagraph>DX: {courtData.dx}</GovParagraph>

                            <GovH3 className="govuk-heading-m govuk-!-margin-top-4">
                                Professional users&apos; court and tribunal access scheme
                            </GovH3>
                            <GovParagraph>
                                This location participates in this scheme
                            </GovParagraph>
                            <GovParagraph className="govuk-!-margin-bottom-4">
                                <a
                                    className="govuk-link"
                                    href="https://www.gov.uk/guidance/professional-users-court-and-tribunal-access-scheme"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Register for the scheme (opens in new tab)"
                                >
                                    Register for the scheme
                                </a>
                            </GovParagraph>
                        </div>
                    </div>
                </main>
            </GovContainer>
            <GovFooter>
                <div className="govuk-footer__meta">
                    <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
                        <h2 className="govuk-visually-hidden">Support links</h2>
                        <ul className="govuk-footer__inline-list">
                            <li className="govuk-footer__inline-list-item">
                                <Link href="/" className="govuk-footer__link">
                                    Home
                                </Link>
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
                                d="M421.5 142.8V.1l-50.7 32.3v161.1h112.4v-50.7zm-122.3-9.6A47.12 47.12 0 0 1 221 97.8c0-26 21.1-47.1 47.1-47.1 16.7 0 31.4 8.7 39.7 21.8l42.7-27.2A97.63 97.63 0 0 0 268.1 0c-36.5 0-68.3 20.1-85.1 49.7A98 98 0 0 0 97.8 0C43.9 0 0 43.9 0 97.8s43.9 97.8 97.8 97.8c36.5 0 68.3-20.1 85.1-49.7a97.76 97.76 0 0 0 149.6 25.4l19.4 22.2h3v-87.8h-80l24.3 27.5zM97.8 145c-26 0-47.1-21.1-47.1-47.1s21.1-47.1 47.1-47.1 47.2 21 47.2 47S123.8 145 97.8 145"
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
                </div>
            </GovFooter>
        </>
    );
}

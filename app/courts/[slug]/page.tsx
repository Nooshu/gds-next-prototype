import { notFound } from "next/navigation";
import GovHeader from "@/components/govuk/GovHeader";
import GovContainer from "@/components/govuk/GovContainer";
import { GovH1, GovH2 } from "@/components/govuk/GovHeading";
import Link from "next/link";
import FocusOnRender from "@/components/a11y/FocusOnRender";
import GovBreadcrumbs from "@/components/govuk/GovBreadcrumbs";
import { Metadata } from "next";

interface Court {
    slug: string;
    name: string;
    type: string;
    area: string;
    address: {
        line1: string;
        line2: string;
        line3?: string;
        postcode: string;
    };
    contact: {
        phone: string;
        email: string;
    };
    openingHours: {
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
    };
    facilities: string[];
    description: string;
}

interface CourtPageProps {
    params: {
        slug: string;
    };
}

async function getCourt(slug: string): Promise<Court | null> {
    try {
        const court = await import(`../../_data/courts/${slug}.json`);
        return court.default;
    } catch {
        return null;
    }
}

export async function generateStaticParams() {
    const courts = await import("../../_data/courts/index.json");
    return courts.default.map((court: { slug: string }) => ({
        slug: court.slug,
    }));
}

export async function generateMetadata({ params }: CourtPageProps): Promise<Metadata> {
    const court = await getCourt(params.slug);
    return {
        title: court ? court.name : "Court details",
    };
}

export default async function CourtPage({ params }: CourtPageProps) {
    const court = await getCourt(params.slug);

    if (!court) {
        notFound();
    }

    return (
        <>
            <FocusOnRender />
            <GovHeader serviceName="Find a court or tribunal" />
            <main className="govuk-main-wrapper" id="main-content" role="main">
                <GovContainer>
                    <GovBreadcrumbs
                        items={[
                            { href: "/", text: "Home" },
                            { href: "#", text: court.name },
                        ]}
                    />

                    <GovH1>{court.name}</GovH1>

                    <div className="govuk-inset-text">
                        <p>{court.description}</p>
                    </div>

                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds">
                            <GovH2>Contact details</GovH2>

                            <dl className="govuk-summary-list">
                                <div className="govuk-summary-list__row">
                                    <dt className="govuk-summary-list__key">
                                        Address
                                    </dt>
                                    <dd className="govuk-summary-list__value">
                                        {court.address.line1}
                                        <br />
                                        {court.address.line2}
                                        <br />
                                        {court.address.line3 && (
                                            <>
                                                {court.address.line3}
                                                <br />
                                            </>
                                        )}
                                        {court.address.postcode}
                                    </dd>
                                </div>
                                <div className="govuk-summary-list__row">
                                    <dt className="govuk-summary-list__key">
                                        Phone
                                    </dt>
                                    <dd className="govuk-summary-list__value">
                                        <a
                                            href={`tel:${court.contact.phone}`}
                                            className="govuk-link"
                                        >
                                            {court.contact.phone}
                                        </a>
                                    </dd>
                                </div>
                                <div className="govuk-summary-list__row">
                                    <dt className="govuk-summary-list__key">
                                        Email
                                    </dt>
                                    <dd className="govuk-summary-list__value">
                                        <a
                                            href={`mailto:${court.contact.email}`}
                                            className="govuk-link"
                                        >
                                            {court.contact.email}
                                        </a>
                                    </dd>
                                </div>
                            </dl>

                            <GovH2>Opening hours</GovH2>
                            <dl className="govuk-summary-list">
                                <div className="govuk-summary-list__row">
                                    <dt className="govuk-summary-list__key">
                                        Monday
                                    </dt>
                                    <dd className="govuk-summary-list__value">
                                        {court.openingHours.monday}
                                    </dd>
                                </div>
                                <div className="govuk-summary-list__row">
                                    <dt className="govuk-summary-list__key">
                                        Tuesday
                                    </dt>
                                    <dd className="govuk-summary-list__value">
                                        {court.openingHours.tuesday}
                                    </dd>
                                </div>
                                <div className="govuk-summary-list__row">
                                    <dt className="govuk-summary-list__key">
                                        Wednesday
                                    </dt>
                                    <dd className="govuk-summary-list__value">
                                        {court.openingHours.wednesday}
                                    </dd>
                                </div>
                                <div className="govuk-summary-list__row">
                                    <dt className="govuk-summary-list__key">
                                        Thursday
                                    </dt>
                                    <dd className="govuk-summary-list__value">
                                        {court.openingHours.thursday}
                                    </dd>
                                </div>
                                <div className="govuk-summary-list__row">
                                    <dt className="govuk-summary-list__key">
                                        Friday
                                    </dt>
                                    <dd className="govuk-summary-list__value">
                                        {court.openingHours.friday}
                                    </dd>
                                </div>
                                <div className="govuk-summary-list__row">
                                    <dt className="govuk-summary-list__key">
                                        Saturday
                                    </dt>
                                    <dd className="govuk-summary-list__value">
                                        {court.openingHours.saturday}
                                    </dd>
                                </div>
                                <div className="govuk-summary-list__row">
                                    <dt className="govuk-summary-list__key">
                                        Sunday
                                    </dt>
                                    <dd className="govuk-summary-list__value">
                                        {court.openingHours.sunday}
                                    </dd>
                                </div>
                            </dl>

                            <GovH2>Facilities</GovH2>
                            <ul className="govuk-list govuk-list--bullet">
                                {court.facilities.map((facility, index) => (
                                    <li key={index}>{facility}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </GovContainer>
            </main>
        </>
    );
}

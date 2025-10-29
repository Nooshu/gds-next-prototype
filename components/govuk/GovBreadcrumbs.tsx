import Link from "next/link";

interface Crumb {
    href: string;
    text: string;
}

export default function GovBreadcrumbs({ items }: { items: Crumb[] }) {
    return (
        <nav className="govuk-breadcrumbs" aria-label="Breadcrumb">
            <ol className="govuk-breadcrumbs__list">
                {items.map((item, idx) => (
                    <li
                        key={idx}
                        className={`govuk-breadcrumbs__list-item${
                            idx === items.length - 1
                                ? " govuk-breadcrumbs__list-item--active"
                                : ""
                        }`}
                    >
                        {idx < items.length - 1 ? (
                            <Link
                                className="govuk-breadcrumbs__link"
                                href={item.href}
                            >
                                {item.text}
                            </Link>
                        ) : (
                            <span aria-current="page">{item.text}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

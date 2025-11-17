interface GovH1Props {
  children: React.ReactNode;
  className?: string;
}

interface GovH2Props {
  children: React.ReactNode;
  className?: string;
}

export function GovH1({ children, className = "" }: GovH1Props) {
  return (
    <h1 className={`govuk-heading-xl ${className}`}>
      {children}
    </h1>
  );
}

export function GovH2({ children, className = "" }: GovH2Props) {
  return (
    <h2 className={`govuk-heading-l ${className}`}>
      {children}
    </h2>
  );
}

interface GovH3Props {
  children: React.ReactNode;
  className?: string;
}

export function GovH3({ children, className = "" }: GovH3Props) {
  return (
    <h3 className={`govuk-heading-m ${className}`}>
      {children}
    </h3>
  );
}

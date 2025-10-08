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

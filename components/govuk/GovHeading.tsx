interface GovH1Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

interface GovH2Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

export function GovH1({ children, className = "", ...props }: GovH1Props) {
  return (
    <h1 className={`govuk-heading-xl ${className}`.trim()} {...props}>
      {children}
    </h1>
  );
}

export function GovH2({ children, className = "", ...props }: GovH2Props) {
  return (
    <h2 className={`govuk-heading-l ${className}`.trim()} {...props}>
      {children}
    </h2>
  );
}

interface GovH3Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

export function GovH3({ children, className = "", ...props }: GovH3Props) {
  return (
    <h3 className={`govuk-heading-m ${className}`.trim()} {...props}>
      {children}
    </h3>
  );
}

interface GovContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function GovContainer({ children, className = "" }: GovContainerProps) {
  return (
    <div className={`govuk-width-container ${className}`}>
      {children}
    </div>
  );
}

"use client";

import { useState, useId } from "react";
import { useRouter } from "next/navigation";

export default function SearchTemplate() {
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const inputId = useId();
  const errorId = useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError("Enter a court or tribunal name");
      return;
    }
    
    setError("");
    router.push(`/results?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--l" htmlFor={inputId}>
          Find a court or tribunal
        </label>
        <div id={`${inputId}-hint`} className="govuk-hint">
          Enter the name of a court or tribunal, for example Manchester Crown Court
        </div>
        {error && (
          <p id={errorId} className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span>
            {error}
          </p>
        )}
        <input
          className={`govuk-input ${error ? "govuk-input--error" : ""}`}
          id={inputId}
          name="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-describedby={error ? errorId : `${inputId}-hint`}
          aria-invalid={error ? "true" : "false"}
        />
      </div>
      <button className="govuk-button" data-module="govuk-button" type="submit">
        Search
      </button>
    </form>
  );
}

import React from 'react'
import { clsx } from 'clsx'

interface ErrorMessageProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  children, 
  className,
  id
}) => {
  return (
    <span className={clsx('govuk-error-message', className)} id={id}>
      <span className="govuk-visually-hidden">Error:</span>
      {children}
    </span>
  )
}

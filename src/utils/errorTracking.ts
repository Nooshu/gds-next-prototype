interface ErrorData {
  type: string
  message: string
  filename?: string
  lineno?: number
  colno?: number
  stack?: string
  timestamp: number
  url: string
  userAgent: string
  performanceMetrics?: any
  sessionId?: string
  userId?: string | null
  context?: any
}

class ErrorTracker {
  private apiEndpoint: string
  private isEnabled: boolean = true

  constructor(apiEndpoint: string = '') {
    this.apiEndpoint = apiEndpoint
    this.init()
  }

  private init(): void {
    if (!this.isEnabled) return

    window.addEventListener('error', (event) => this.trackError(event))
    window.addEventListener('unhandledrejection', (event) => this.trackPromiseRejection(event))
    
    // Track React errors
    this.trackReactErrors()
  }

  private trackError(event: ErrorEvent): void {
    const errorData: ErrorData = {
      type: 'JavaScript Error',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      performanceMetrics: this.getCurrentMetrics(),
      sessionId: this.getSessionId(),
      userId: this.getUserId(),
    }

    this.sendError(errorData)
  }

  private trackPromiseRejection(event: PromiseRejectionEvent): void {
    const errorData: ErrorData = {
      type: 'Unhandled Promise Rejection',
      message: event.reason?.message || 'Unknown promise rejection',
      stack: event.reason?.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      performanceMetrics: this.getCurrentMetrics(),
      sessionId: this.getSessionId(),
      userId: this.getUserId(),
    }

    this.sendError(errorData)
  }

  private trackReactErrors(): void {
    // Track React component errors
    const originalConsoleError = console.error
    console.error = (...args) => {
      // Check if this is a React error
      const errorMessage = args.join(' ')
      if (errorMessage.includes('React') || errorMessage.includes('component')) {
        const errorData: ErrorData = {
          type: 'React Error',
          message: errorMessage,
          stack: new Error().stack,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          performanceMetrics: this.getCurrentMetrics(),
          sessionId: this.getSessionId(),
          userId: this.getUserId(),
        }
        this.sendError(errorData)
      }
      
      // Call original console.error
      originalConsoleError.apply(console, args)
    }
  }

  private getCurrentMetrics(): any {
    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      return {
        loadTime: navigation?.loadEventEnd - navigation?.loadEventStart,
        domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
        memoryUsage: (performance as any).memory?.usedJSHeapSize,
        timestamp: Date.now(),
      }
    } catch {
      return { timestamp: Date.now() }
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('performance-session-id')
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      sessionStorage.setItem('performance-session-id', sessionId)
    }
    return sessionId
  }

  private getUserId(): string | null {
    return localStorage.getItem('userId')
  }

  private async sendError(errorData: ErrorData): Promise<void> {
    if (!this.isEnabled) return

    try {
      // Always log errors to console (API endpoints removed)
      console.error('Error Tracked:', errorData)
      
      // If API endpoint is configured, send to server
      if (this.apiEndpoint) {
        await fetch(this.apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorData),
        })
      }
    } catch (error) {
      console.warn('Failed to send error data:', error)
    }
  }

  // Public methods for manual error tracking
  trackCustomError(error: Error, context?: any): void {
    const errorData: ErrorData = {
      type: 'Custom Error',
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      performanceMetrics: this.getCurrentMetrics(),
      sessionId: this.getSessionId(),
      userId: this.getUserId(),
      context,
    }

    this.sendError(errorData)
  }

  trackUserAction(action: string, context?: any): void {
    const errorData: ErrorData = {
      type: 'User Action',
      message: action,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      performanceMetrics: this.getCurrentMetrics(),
      sessionId: this.getSessionId(),
      userId: this.getUserId(),
      context,
    }

    this.sendError(errorData)
  }

  enable(): void {
    this.isEnabled = true
  }

  disable(): void {
    this.isEnabled = false
  }
}

export const errorTracker = new ErrorTracker()
export default ErrorTracker

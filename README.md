# HMCTS GDS Next.js Prototype

A prototype demonstrating GDS-compliant React development using Next.js with Server-Side Rendering (SSR) and Progressive Enhancement.

## Overview

This prototype replicates the core user journey of the Find a Court and Tribunal (FaCT) service using:

-   **Next.js 14** with App Router for SSR-first approach
-   **GOV.UK Frontend** design system for styling and components
-   **MoJ Frontend** for Ministry of Justice specific components
-   **TypeScript** for type safety
-   **Progressive Enhancement** ensuring core functionality works without JavaScript

## Features

-   **Search Interface**: Find courts and tribunals by name
-   **Results Page**: Filtered search results with accessibility features
-   **Court Details**: Individual court pages with contact information, opening hours, and facilities
-   **Accessibility**: WCAG 2.2 AA compliant with skip links, live regions, and keyboard navigation
-   **Performance**: Optimized bundle with code splitting and static generation

## Architecture

### GOV.UK Component Wrappers

Thin React wrappers around GOV.UK Frontend components:

-   `GovHeader` - Service header with GOV.UK branding
-   `GovContainer` - Width container for consistent layout
-   `GovHeading` - H1/H2 headings with GOV.UK styling
-   `SearchTemplate` - Client component with form validation

### Pages

-   `/` - Home page with search form
-   `/results` - Search results with filtering
-   `/courts/[slug]` - Individual court details (statically generated)

### Data

Mock court data stored in JSON files:

-   Manchester Crown Court
-   Birmingham Crown Court
-   Inner London Crown Court

## Setup

1. Install dependencies:

    ```bash
    npm install
    ```

2. Run development server:

    ```bash
    npm run dev
    ```

3. Open [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm start
```

## Key Implementation Notes

-   **SSR-First**: All pages render on the server for better SEO and performance
-   **Progressive Enhancement**: Core functionality works without JavaScript
-   **Accessibility**: Skip links, live regions, semantic HTML, keyboard navigation
-   **Type Safety**: Full TypeScript coverage with proper interfaces
-   **Static Generation**: Court pages pre-generated at build time

## GOV.UK Compliance

This prototype demonstrates:

-   Proper use of GOV.UK Frontend components
-   Accessibility best practices (WCAG 2.2 AA)
-   Progressive enhancement patterns
-   Semantic HTML structure
-   Focus management and keyboard navigation

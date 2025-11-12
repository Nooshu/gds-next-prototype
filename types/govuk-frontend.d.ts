declare global {
    interface Window {
        GOVUKFrontend?: {
            initAll: (scopeOrConfig?: Element | Document | Record<string, unknown>) => void;
            Accordion?: unknown;
            Button?: unknown;
            CharacterCount?: unknown;
            Checkboxes?: unknown;
            ErrorSummary?: unknown;
            ExitThisPage?: unknown;
            Header?: unknown;
            NotificationBanner?: unknown;
            Radios?: unknown;
            SkipLink?: unknown;
            Tabs?: unknown;
        };
    }
}

export {};


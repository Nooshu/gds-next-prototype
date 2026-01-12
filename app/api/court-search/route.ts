import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const data = await req.formData();
    const fullName = (data.get("fullName") as string | null)?.trim() || "";

    const url = new URL(req.url);
    
    // Validate that a search term was provided
    if (!fullName) {
        url.pathname = "/find-a-court-or-tribunal-search";
        url.search = "?error=Enter a court name, address, town or city";
        return NextResponse.redirect(url);
    }

    // Redirect to search page with query parameter
    // The search page will handle displaying results
    url.pathname = "/find-a-court-or-tribunal-search";
    url.search = `?q=${encodeURIComponent(fullName)}`;
    return NextResponse.redirect(url);
}

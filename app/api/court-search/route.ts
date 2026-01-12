import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const data = await req.formData();
    const fullName = (data.get("fullName") as string | null)?.trim() || "";

    // Get the correct host from headers (works behind proxies)
    const host = req.headers.get("host") || req.headers.get("x-forwarded-host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || (req.url.startsWith("https") ? "https" : "http");
    
    // Validate that a search term was provided
    if (!fullName) {
        const url = new URL(`${protocol}://${host}/find-a-court-or-tribunal-search`);
        url.search = "?error=Enter a court name, address, town or city";
        return NextResponse.redirect(url);
    }

    // Redirect to search page with query parameter
    // The search page will handle displaying results
    const url = new URL(`${protocol}://${host}/find-a-court-or-tribunal-search`);
    url.search = `?q=${encodeURIComponent(fullName)}`;
    return NextResponse.redirect(url);
}

import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const data = await req.formData();
    const courtOption = (data.get("courtOption") as string | null)?.trim() || "";

    // Get the correct host from headers (works behind proxies)
    const host = req.headers.get("host") || req.headers.get("x-forwarded-host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || (req.url.startsWith("https") ? "https" : "http");
    
    // Validate that an option was selected
    if (!courtOption) {
        const url = new URL(`${protocol}://${host}/find-a-court-or-tribunal-backup`);
        url.search = "?error=Select whether you know the name of the court or tribunal";
        return NextResponse.redirect(url);
    }

    // Navigate to the search page regardless of which option was selected
    // (both options currently go to the same page)
    const url = new URL(`${protocol}://${host}/find-a-court-or-tribunal-search`);
    return NextResponse.redirect(url);
}

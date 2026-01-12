import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const data = await req.formData();
    const courtOption = (data.get("courtOption") as string | null)?.trim() || "";

    const url = new URL(req.url);
    
    // Validate that an option was selected
    if (!courtOption) {
        url.pathname = "/find-a-court-or-tribunal-backup";
        url.search = "?error=Select whether you know the name of the court or tribunal";
        return NextResponse.redirect(url);
    }

    // Navigate to the search page regardless of which option was selected
    // (both options currently go to the same page)
    url.pathname = "/find-a-court-or-tribunal-search";
    return NextResponse.redirect(url);
}

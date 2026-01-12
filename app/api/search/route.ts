import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const data = await req.formData();
    const q = (data.get("search") as string | null)?.trim() || "";

    // Get the correct host from headers (works behind proxies)
    const host = req.headers.get("host") || req.headers.get("x-forwarded-host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || (req.url.startsWith("https") ? "https" : "http");
    
    if (!q) {
        const url = new URL(`${protocol}://${host}/`);
        url.search = "?error=Enter a court or tribunal name";
        return NextResponse.redirect(url);
    }

    const url = new URL(`${protocol}://${host}/results`);
    url.search = `?q=${encodeURIComponent(q)}`;
    return NextResponse.redirect(url);
}

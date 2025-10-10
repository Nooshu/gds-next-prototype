import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const data = await req.formData();
    const q = (data.get("search") as string | null)?.trim() || "";

    const url = new URL(req.url);
    if (!q) {
        url.pathname = "/";
        url.search = "?error=Enter a court or tribunal name";
        return NextResponse.redirect(url);
    }

    url.pathname = "/results";
    url.search = `?q=${encodeURIComponent(q)}`;
    return NextResponse.redirect(url);
}

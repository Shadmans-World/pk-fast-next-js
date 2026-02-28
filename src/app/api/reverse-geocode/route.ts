import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return NextResponse.json({ error: "Missing lat or lon" }, { status: 400 });
    }

    // Call Nominatim using axios
    const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: {
        lat,
        lon,
        format: "json",
      },
      headers: {
        "User-Agent": "pk-fast-app (shshaon99@gmail.com)", // must include your email
        "Accept-Language": "en",
      },
      timeout: 5000, // optional
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Nominatim Axios error:", error.message || error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

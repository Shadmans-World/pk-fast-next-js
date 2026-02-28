import axios from "axios";
import { NextRequest, NextResponse } from "next/server"



export async function GET(req: NextRequest){
    try {
        const {searchParams} = new URL(req.url);
        const q = searchParams.get("q");

        if(!q){
            return NextResponse.json(
                {error:"Missing Query"},
                {status:400}
            )
        }

        const response = await axios.get( "https://nominatim.openstreetmap.org/search",{
            params:{
                q,
                format:"json",
                addressDetails: 1,
            },
            headers:{
                "User-Agent":"pk-fast-app (shshaon99@gmail.com)",
                "Accept-Language":"en",
            }
        });
        return NextResponse.json(response.data)

    } catch (error:any) {
        console.error(error.response?.data || error.message);
        return NextResponse.json(
            {error:"Search Failed"},
            {status:500}
        )
    }
}
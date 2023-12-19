import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req){
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({cookies: () => cookieStore});

    // get current session from supabase
    const {data: {session}} = await supabase.auth.getSession();

    //sign out of session
    if(session){
        await supabase.auth.signOut();
    }

    //redirect to home page
    return NextResponse.redirect(new URL('/', req.url), {status: 302});
}
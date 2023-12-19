import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import {NextResponse} from 'next/server'

export async function middleware(req){
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({req, res});

    const {data: {user}} = await supabase.auth.getUser();

    //if the user is logged in we want to send the user to our watch logged in page
    if (user && req.nextUrl.pathname === '/'){
        return NextResponse.redirect(new URL('/watch-list', req.url))
    }

    // if we dont have a user and they're trying to access any page other than the login page, redirect them to the login page
    if(!user && req.nextUrl.pathname !== '/'){
        return NextResponse.redirect(new URL('/', req.url))
    }

    return res;
}

// run this middleware when they try to access the homepage or watch list page
export const config = {
    matcher: ['/', '/watch-list']
}
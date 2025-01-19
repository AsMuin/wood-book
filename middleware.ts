import { type NextFetchEvent, type NextRequest, NextResponse } from 'next/server';
import ratelimit from '@/lib/ratelimit';

export async function middleware(request: NextRequest, context: NextFetchEvent): Promise<Response | undefined> {
    const headers = request.headers;
    const ip = headers.get('x-forwarded-for') || headers.get('x-real-ip') || '127.0.0.1';
    const { success, pending, limit, remaining } = await ratelimit.limit(ip);

    context.waitUntil(pending);

    const res = success ? NextResponse.next() : NextResponse.redirect('/tooFast');

    res.headers.set('X-RateLimit-Success', success.toString());
    res.headers.set('X-RateLimit-Limit', limit.toString());
    res.headers.set('X-RateLimit-Remaining', remaining.toString());

    return res;
}

export const config = {
    matcher: '/'
};

import { tableQueryBook } from '@/lib/actions/book';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 10;
    const pageIndex = searchParams.get('pageIndex') ? Number(searchParams.get('pageIndex')) : 0;

    const result = await tableQueryBook(limit, pageIndex);

    return NextResponse.json(result);
}

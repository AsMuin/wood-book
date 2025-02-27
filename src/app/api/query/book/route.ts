import { tableQueryBook } from '@/lib/admin/actions/book';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 10;
    const pageIndex = searchParams.get('pageIndex') ? Number(searchParams.get('pageIndex')) : 0;
    const title = searchParams.get('title') || '';
    const author = searchParams.get('author') || '';
    const genre = searchParams.get('genre') || '';

    const result = await tableQueryBook({ limit, pageIndex, title, author, genre });

    return NextResponse.json(result);
}

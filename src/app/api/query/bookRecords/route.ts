import { tableQueryBorrowRecord } from '@/lib/admin/actions/borrowRecord';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 10;
    const pageIndex = searchParams.get('pageIndex') ? Number(searchParams.get('pageIndex')) : 0;
    const userName = searchParams.get('userName') || '';
    const bookName = searchParams.get('bookName') || '';
    const status = searchParams.get('status') as 'BORROWED' | 'RETURNED' | undefined;

    const result = await tableQueryBorrowRecord({ limit, pageIndex, userName, bookName, status });

    return NextResponse.json(result);
}

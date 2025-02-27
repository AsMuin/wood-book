import { tableQueryUser } from '@/lib/admin/actions/user';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 10;
    const pageIndex = searchParams.get('pageIndex') ? Number(searchParams.get('pageIndex')) : 0;
    const role: 'USER' | 'ADMIN' = (searchParams.get('role') as 'USER' | 'ADMIN') || '';

    const result = await tableQueryUser({ limit, pageIndex, role });

    return NextResponse.json(result);
}

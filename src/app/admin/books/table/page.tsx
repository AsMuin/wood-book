'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { IBook, IResponse, TableColumnsConfig } from '../../../../../types';
import AdminTable from '@/components/admin/AdminTable';

export default function AddBookPage() {
    const tableColumns: TableColumnsConfig<IBook> = {
        title: {
            header: '书名'
        },
        coverColor: {
            header: '封面颜色'
        },
        coverUrl: {
            header: '封面'
        },
        description: {
            header: '描述'
        }
    };

    async function tableQueryBook(limit: number, pageIndex: number) {
        const result = await fetch(`/api/query/book?limit=${limit}&pageIndex=${pageIndex}`);

        return (await result.json()) as IResponse<IBook[]>;
    }

    return (
        <>
            <Button asChild className="back-btn rounded-sm">
                <Link href="/admin/books">返回</Link>
            </Button>
            <section className="w-full">
                <AdminTable query={tableQueryBook} columns={tableColumns} title="所有书籍" />
            </section>
        </>
    );
}

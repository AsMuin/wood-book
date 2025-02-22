'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { IBook, TableColumnsConfig } from '../../../../../types';
import AdminTable from '@/components/admin/AdminTable';
import { tableQueryBook } from '@/lib/actions/book';

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

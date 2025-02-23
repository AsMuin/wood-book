'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { IBook, IResponse, TableColumnsConfig } from '../../../../../types';
import AdminTable from '@/components/admin/AdminTable';
import Image from 'next/image';

export default function AddBookPage() {
    const tableColumns: TableColumnsConfig<IBook> = {
        title: {
            header: '书名',
            render: value => <h4 className="w-64 scroll-m-20 text-lg font-semibold tracking-tight">《{value}》</h4>
        },
        coverColor: {
            header: '封面颜色',
            render: value => <div style={{ backgroundColor: value }} className="h-8 w-8 rounded-sm" />
        },
        coverUrl: {
            header: '封面',
            render: value => <Image src={value} alt="book cover" width={100} height={100} />
        },
        description: {
            header: '描述',
            render: value => <blockquote className="mt-6 w-96 border-l-2 pl-6 italic">{value}</blockquote>
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

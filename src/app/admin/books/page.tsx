'use client';

import AdminTable from '@/components/admin/AdminTable';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { BookQueryParams, IBook, IResponse, QueryParams, SearchColumns, TableColumnsConfig, TableRef } from '@types';
import { useSession } from 'next-auth/react';
import { deleteBook } from '@/lib/admin/actions/book';
import { toast } from '@/hooks/useToast';
import { useRef } from 'react';
import PopoverConfirm from '@/components/PopoverConfirm';
import { transformGetParams } from '@/lib/utils';

export default function BooksPage() {
    const { data: session } = useSession();
    const userId = session?.user?.id || '';
    const tableRef = useRef<TableRef>(null);
    const tableColumns: TableColumnsConfig<IBook> = {
        title: {
            header: '书名',
            render: value => <h4 className="w-64 scroll-m-20 text-lg font-semibold tracking-tight">《{value}》</h4>
        },
        author: {
            header: '作者',
            render: value => <h4 className="w-64 scroll-m-20 text-lg font-semibold tracking-tight">{value}</h4>
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

    async function onDelete(id: string) {
        try {
            const result = await deleteBook(id, userId);

            if (!result.success) {
                throw new Error(result.message);
            }

            toast({
                title: '成功',
                description: '删除成功'
            });

            tableRef.current?.query();
        } catch (error) {
            toast({
                title: '失败',
                description: error instanceof Error ? error.message : '删除失败',
                variant: 'destructive'
            });
        }
    }

    const bookSearchParams: SearchColumns<BookQueryParams> = {
        title: {
            label: '书名',
            placeholder: '请填写书名',
            defaultValue: ''
        },
        author: {
            label: '作者',
            placeholder: '请填写作者名字',
            defaultValue: ''
        }
    };
    const operations = (rowData: IBook) => (
        <div className="flex flex-col gap-2">
            <Button variant={'link'} className="text-primary">
                <Link href={`/admin/books/edit/${rowData.id}`}>编辑</Link>
            </Button>
            <PopoverConfirm
                onConfirm={() => onDelete(rowData.id)}
                trigger={
                    <Button variant={'link'} className="text-red-600">
                        删除
                    </Button>
                }>
                确定删除该书籍吗？
            </PopoverConfirm>
        </div>
    );

    async function tableQueryBook({ pageIndex, limit, signal, ...searchParams }: QueryParams<BookQueryParams>) {
        const requestUrl = transformGetParams({
            baseUrl: '/api/query/book',
            params: {
                pageIndex: pageIndex.toString(),
                limit: limit.toString(),
                ...searchParams
            }
        });
        const result = await fetch(requestUrl, { signal });

        return (await result.json()) as IResponse<IBook[]>;
    }

    return (
        <section className="w-full rounded-2xl bg-white p-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
                {/* <h2 className="text-xl font-semibold">所有书籍</h2> */}
                <Button className="bg-primary-admin" asChild>
                    <Link href="/admin/books/add" className="text-white">
                        添加一个新的书籍
                    </Link>
                </Button>
            </div>
            <div className="mt-7 w-full overflow-hidden">
                <AdminTable
                    ref={tableRef}
                    query={tableQueryBook}
                    columns={tableColumns}
                    searchFilter={bookSearchParams}
                    title="所有书籍"
                    operations={operations}
                />
            </div>
        </section>
    );
}

'use client';

import AdminTable from '@/components/admin/AdminTable';
import { Button } from '@/components/ui/button';
import { BorrowRecordQueryParams, IBorrowRecord, IResponse, QueryParams, SearchColumns, TableColumns, TableRef } from '@types';
import { useSession } from 'next-auth/react';
import { toast } from '@/hooks/useToast';
import { useRef } from 'react';
import PopoverConfirm from '@/components/PopoverConfirm';
import { transformGetParams } from '@/lib/utils';
import Select from '@/components/Select';
import { deleteBorrowRecord } from '@/lib/admin/actions/borrowRecord';
import dayjs from 'dayjs';

const borrowRecordStatusEnum = {
    BORROWED: '借阅中',
    RETURNED: '已还书'
};

export default function BorrowRecordsPage() {
    const { data: session } = useSession();
    const userId = session?.user?.id || '';
    const tableRef = useRef<TableRef>(null);
    const tableColumns: TableColumns<IBorrowRecord> = {
        bookName: {
            header: '书籍'
        },
        userName: {
            header: '用户'
        },
        status: {
            header: '状态',
            render: value => borrowRecordStatusEnum[value as keyof typeof borrowRecordStatusEnum] || value
        },
        startDate: {
            header: '借阅时间',
            render: value => dayjs(value).format('YYYY-MM-DD')
        },
        returnDate: {
            header: '还书时间'
        }
    };

    async function onDelete(id: string) {
        try {
            const result = await deleteBorrowRecord(id, userId);

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

    const borrowRecordSearchParams: SearchColumns<BorrowRecordQueryParams> = {
        userName: {
            label: '用户',
            placeholder: '请输入用户名',
            defaultValue: ''
        },
        bookName: {
            label: '书名',
            placeholder: '请输入书名',
            defaultValue: ''
        },
        status: {
            label: '状态',
            render: (value, allParams, onChange) => (
                <Select
                    value={value}
                    onChange={onChange}
                    placeholder="请选择借阅状态"
                    options={[
                        { value: 'BORROWED', label: '借阅中' },
                        { value: 'RETURNED', label: '已归还' }
                    ]}
                />
            )
        }
    };
    const operations = (rowData: IBorrowRecord) => (
        <div className="flex flex-col gap-2">
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

    async function tableQueryBorrowRecord({ pageIndex, limit, signal, ...searchParams }: QueryParams<BorrowRecordQueryParams>) {
        const requestUrl = transformGetParams({
            baseUrl: '/api/query/bookRecords',
            params: {
                pageIndex: pageIndex.toString(),
                limit: limit.toString(),
                ...searchParams
            }
        });
        const result = await fetch(requestUrl, { signal });

        return (await result.json()) as IResponse<IBorrowRecord[]>;
    }

    return (
        <section className="w-full rounded-2xl bg-white p-7">
            <div className="mt-7 w-full overflow-hidden">
                <AdminTable
                    ref={tableRef}
                    query={tableQueryBorrowRecord}
                    columns={tableColumns}
                    searchFilter={borrowRecordSearchParams}
                    title="所有借书记录"
                    operations={operations}
                />
            </div>
        </section>
    );
}

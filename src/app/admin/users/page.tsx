'use client';

import AdminTable from '@/components/admin/AdminTable';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { IUser, IResponse, QueryParams, TableRef, TableColumns, UserQueryParams } from '@types';
import { useSession } from 'next-auth/react';
import { deleteBook } from '@/lib/admin/actions/book';
import { toast } from '@/hooks/useToast';
import { useRef } from 'react';
import PopoverConfirm from '@/components/PopoverConfirm';
import dayjs from 'dayjs';
import { transformGetParams } from '@/lib/utils';
import { changeUserPermission } from '@/lib/admin/actions/user';

const UserEnum = {
    ADMIN: '管理员',
    USER: '普通用户'
};

export default function UsersPage() {
    const { data: session } = useSession();
    const userId = session?.user?.id || '';
    const tableRef = useRef<TableRef>(null);
    const now = dayjs();
    const tableColumns: TableColumns<IUser> = {
        name: {
            header: '用户名'
        },
        email: {
            header: '邮箱'
        },
        role: {
            header: '权限',
            render: value => UserEnum[value!] || value
        },
        image: {
            header: '认证图片',
            render: value => <Image src={value!} alt="book cover" width={100} height={100} />
        },
        lastActivityDate: {
            header: '是否活跃',
            render: value => {
                if (!value) {
                    return '不活跃';
                } else {
                    const diff = now.diff(value, 'day');

                    return diff > 3 ? '不活跃' : '活跃';
                }
            }
        },
        createAt: {
            header: '创建时间',
            render: value => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
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

    async function onRoleChange(id: string, role: 'USER' | 'ADMIN') {
        try {
            const result = await changeUserPermission(id, userId, role);

            if (!result.success) {
                throw new Error(result.message);
            }

            toast({
                title: '成功',
                description: '角色切换成功'
            });

            tableRef.current?.query();
        } catch (error) {
            toast({
                title: '失败',
                description: error instanceof Error ? error.message : '角色切换失败',
                variant: 'destructive'
            });
        }
    }

    const operations = (rowData: IUser) => (
        <div className="flex flex-col gap-2">
            <PopoverConfirm
                onConfirm={() => onRoleChange(rowData.id, rowData.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                trigger={
                    <Button variant={'link'} className="text-primary">
                        {rowData.role === 'ADMIN' ? '切换为普通用户' : '切换为管理员'}
                    </Button>
                }>
                确定将该角色切换为{rowData.role === 'ADMIN' ? '普通用户' : '管理员'}吗？
            </PopoverConfirm>

            <PopoverConfirm
                onConfirm={() => onDelete(rowData.id)}
                trigger={
                    <Button variant={'link'} className="text-red-600">
                        删除
                    </Button>
                }>
                确定删除该用户吗？
            </PopoverConfirm>
        </div>
    );

    async function tableQueryUser({ limit, pageIndex, signal, ...searchParams }: QueryParams<UserQueryParams>) {
        const requestUrl = transformGetParams({
            baseUrl: '/api/query/user',
            params: {
                limit: limit.toString(),
                pageIndex: pageIndex.toString(),
                ...searchParams
            }
        });

        const result = await fetch(requestUrl, { signal });

        return (await result.json()) as IResponse<IUser[]>;
    }

    return (
        <section className="w-full rounded-2xl bg-white p-7">
            <div className="flex flex-wrap items-center justify-between gap-2">{/* <h2 className="text-xl font-semibold">所有书籍</h2> */}</div>
            <div className="mt-7 w-full overflow-hidden">
                <AdminTable ref={tableRef} query={tableQueryUser} columns={tableColumns} title="所有用户" operations={operations} />
            </div>
        </section>
    );
}

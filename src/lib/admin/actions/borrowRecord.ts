'use server';

import db from '@/db';
import { borrowRecords } from '@/db/schema';
import { queryBorrowRecord } from '@/db/utils/borrowRecord';
import { selectUserById } from '@/db/utils/users';
import responseBody from '@/lib/response';
import { BorrowRecordQueryParams } from '@types';
import { eq } from 'drizzle-orm';

async function tableQueryBorrowRecord({ limit, pageIndex, ...filterParams }: { limit: number; pageIndex: number } & BorrowRecordQueryParams) {
    try {
        const [data,total] = await queryBorrowRecord({ limit, pageIndex, ...filterParams });

        return responseBody(true, '查询成功', {
            data,
            total,
            pageIndex,
            limit
        });
    } catch (error) {
        return responseBody(false, error instanceof Error ? error.message : '查询失败');
    }
}

async function deleteBorrowRecord(id: string, userId: string) {
    try {
        const user = await selectUserById(userId);

        if (user?.role !== 'ADMIN') {
            throw new Error('你无权进行该操作');
        }

        await db.delete(borrowRecords).where(eq(borrowRecords.id, id));

        return responseBody(true, '删除成功');
    } catch (error) {
        return responseBody(false, error instanceof Error ? error.message : '删除失败');
    }
}

export { tableQueryBorrowRecord, deleteBorrowRecord };

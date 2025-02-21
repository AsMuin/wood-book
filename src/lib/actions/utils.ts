'use server';

import db from '@/db';
import { selectUserByEmail } from '@/db/utils/users';

type UserState = 'non-active' | 'active';
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const THREE_DAYS_IN_MS = ONE_DAY_IN_MS * 3;
const ONE_MONTH_IN_MS = ONE_DAY_IN_MS * 30;

//获取当前用户的状态
async function getUserState(email: string): Promise<UserState> {
    const user = await selectUserByEmail(email);

    if (!user) {
        return 'non-active';
    }

    const lastActivityDate = new Date(user.lastActivityDate || user.createAt!);

    const now = new Date();
    const timeDifference = now.getTime() - lastActivityDate.getTime();

    if (timeDifference > THREE_DAYS_IN_MS && timeDifference <= ONE_MONTH_IN_MS) {
        return 'non-active';
    }

    return 'active';
}

//查询书籍是否归还了
async function getBorrowState(recordId: string): Promise<boolean> {
    const borrowRecord = await db.query.borrowRecords.findFirst({
        where: (table, { eq }) => eq(table.id, recordId)
    });

    if (!borrowRecord) {
        throw new Error('不存在该借阅记录');
    }

    return borrowRecord.status === 'RETURNED';
}

export { getUserState, getBorrowState };

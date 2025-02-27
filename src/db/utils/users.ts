import { desc, eq, SQL } from 'drizzle-orm';
import db from '..';
import { users } from '../schema';
import { UserQueryParams } from '@types';
import { queryFilter } from '@/lib/utils';

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

//id查询用户
function selectUserById(userId: string) {
    return db.query.users.findFirst({
        where: (table, { eq }) => eq(table.id, userId)
    });
}

//email查询用户
function selectUserByEmail(email: string) {
    return db.query.users.findFirst({
        where: (table, { eq }) => eq(table.email, email)
    });
}

//分页查询用户
function queryUser({ limit = 10, pageIndex = 0, ...filterParams }: { limit: number; pageIndex: number } & UserQueryParams) {
    const filterConfigMap = {
        role: (value: 'USER' | 'ADMIN') => eq(users.role, value)
    };

    const filters: SQL[] = queryFilter(filterConfigMap, filterParams);

    return db.query.users.findMany({
        limit,
        offset: pageIndex * limit,
        orderBy: desc(users.createAt),
        where: (table, { and }) => and(...filters)
    });
}

export { selectUserById, selectUserByEmail, queryUser, getUserState };

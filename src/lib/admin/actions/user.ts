'use server';

import db from '@/db';
import { IUser } from '../../../../types';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import responseBody from '@/lib/response';

type EditUserParams = Omit<IUser, 'createAt' | 'lastActivityDate' | 'emailVerified' | 'password'>;
async function editUser({ id, ...user }: EditUserParams) {
    try {
        const user = await db.query.users.findFirst({
            where: (table, { eq }) => eq(table.id, id)
        });

        if (!user) {
            throw new Error('用户不存在');
        }

        await db
            .update(users)
            .set({
                ...user
            })
            .where(eq(users.id, id));

        return responseBody(true, '修改成功');
    } catch (error) {
        return responseBody(false, error instanceof Error ? error.message : '修改失败');
    }
}

async function deleteUser(id: string) {
    try {
        const user = await db.query.users.findFirst({
            where: table => eq(table.id, id)
        });
        if (!user) {
            throw new Error('用户不存在');
        }

        await db.delete(users).where(eq(users.id, id));

        return responseBody(true, '删除成功');
    } catch (error) {
        return responseBody(false, error instanceof Error ? error.message : '删除失败');
    }
}

export { editUser, deleteUser };

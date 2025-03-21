'use server';

import db from '@/db';
import responseBody from '@/lib/response';
import { IUser, UserQueryParams } from '@types';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { queryUser, selectUserById } from '@/db/utils/users';

type EditUserParams = Omit<IUser, 'createAt' | 'lastActivityDate' | 'emailVerified' | 'password' | 'status'>;

//编辑用户
async function editUser({ id, ...userParams }: EditUserParams) {
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
                ...userParams
            })
            .where(eq(users.id, id));

        return responseBody(true, '修改成功');
    } catch (error) {
        return responseBody(false, error instanceof Error ? error.message : '修改失败');
    }
}

//删除用户
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

// 表格查询用户
async function tableQueryUser({ limit, pageIndex, ...filterParams }: { limit: number; pageIndex: number } & UserQueryParams) {
    try {
        const result = await Promise.all([queryUser({ limit, pageIndex, ...filterParams }), db.$count(users)]);

        return responseBody(true, '查询成功', {
            data: result[0],
            total: result[1],
            pageIndex,
            limit
        });
    } catch (error) {
        return responseBody(false, error instanceof Error ? error.message : '查询失败');
    }
}

//更换用户权限
async function changeUserPermission(userId: string, editId: string, role: 'USER' | 'ADMIN') {
    try {
        const user = await selectUserById(userId);

        if (!user) {
            throw new Error('登录状态异常');
        }

        if (user.role !== 'ADMIN') {
            throw new Error('你的权限不足');
        }

        const editUser = await selectUserById(editId);

        if (!editUser) {
            throw new Error('用户不存在');
        }

        await db.update(users).set({ role }).where(eq(users.id, editId));

        return responseBody(true, '权限修改成功');
    } catch (error) {
        return responseBody(false, error instanceof Error ? error.message : '权限修改失败');
    }
}

export { editUser, deleteUser, tableQueryUser, changeUserPermission };

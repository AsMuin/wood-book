import { desc } from 'drizzle-orm';
import db from '..';
import { users } from '../schema';

function selectUserById(userId: string) {
    return db.query.users.findFirst({
        where: (table, { eq }) => eq(table.id, userId)
    });
}

function selectUserByEmail(email: string) {
    return db.query.users.findFirst({
        where: (table, { eq }) => eq(table.email, email)
    });
}

function queryUser(limit: number = 10, pageIndex: number = 0) {
    return db.query.users.findMany({
        limit,
        offset: pageIndex * limit,
        orderBy: desc(users.createAt)
    });
}

export { selectUserById, selectUserByEmail, queryUser };

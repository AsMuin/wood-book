import db from '..';

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

export { selectUserById, selectUserByEmail };

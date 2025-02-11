import { boolean, integer, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core';
import users from './users';

export default pgTable(
    'authenticator',
    {
        credentialID: text('credentialID').notNull().unique(),
        userId: uuid('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        providerAccountId: text('providerAccountId').notNull(),
        credentialPublicKey: text('credentialPublicKey').notNull(),
        counter: integer('counter').notNull(),
        credentialDeviceType: text('credentialDeviceType').notNull(),
        credentialBackedUp: boolean('credentialBackedUp').notNull(),
        transports: text('transports')
    },
    authenticator => [
        {
            compositePK: primaryKey({
                columns: [authenticator.userId, authenticator.credentialID]
            })
        }
    ]
);

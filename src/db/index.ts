import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import users from './schema/users';
import { dataBaseConfig } from '../../envConfig';

const db = drizzle({
    connection: {
        connectionString: dataBaseConfig.url
    },
    schema: {
        users
    }
});

export default db;

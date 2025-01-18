import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import user from './schema/user';
import { dataBaseConfig } from '../../envConfig';

const db = drizzle({
    connection: {
        connectionString: dataBaseConfig.url
    },
    schema: {
        user
    }
});

export default db;

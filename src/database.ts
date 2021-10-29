import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

{/*const {
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD
} = process.env;*/}

const POSTGRES_HOST = "127.0.0.1"
const POSTGRES_DB = "store"
const POSTGRES_USER = "admin_user"
const POSTGRES_PASSWORD = "password123"

const client: Pool = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
});

export default client;
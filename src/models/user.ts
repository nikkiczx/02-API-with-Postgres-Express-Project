import Client from "../database";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';

dotenv.config();

const pepper: string = process.env.BCRYPT_PASSWORD!;
const saltRounds: string = process.env.SALT_ROUNDS!;

export interface User {
  id?: number;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type UserPreview = Omit<User, "password">;

export class UserStore {
  async index(): Promise<UserPreview[]> {
    try {
      const sql = "SELECT id, firstname, lastname, email FROM users";
      const conn = await Client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to get list of users ${error}`);
    }
  }

  async create(user: User): Promise<UserPreview> {
    try {
      const sql = "INSERT INTO users(email, firstname, lastname, password) VALUES ($1, $2, $3, $4) RETURNING id";
      const conn = await Client.connect();
      const hash = bcrypt.hashSync(user.password + pepper, parseInt(saltRounds));

      const result = await conn.query(sql, [user.email, user.firstname, user.lastname, hash]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to create user ${error}`);
    }
  }

  async authenticate(
    email: string,
    password: string
  ): Promise<UserPreview | null> {
    try {
      const sql = "SELECT * FROM users WHERE email=$1";
      const conn = await Client.connect();
      const result = await conn.query(sql ,[email]);
      const passwordToCompare = password + pepper;
      if (result.rowCount > 0) {
        const user = result.rows[0] as User;
        const isPasswordSame = await bcrypt.compare(
          passwordToCompare,
          user.password
        );
        if (isPasswordSame) {
          return user;
        }
      }
      return null;
    } catch (error) {
      throw new Error(`Unable to authenticate user ${error}`);
    }
  }

  async show(id: number): Promise<UserPreview | null> {
    const sql = "SELECT id, firstname, lastname, email FROM users WHERE id=$1";
    const conn = await Client.connect();
    const result = await conn.query(sql ,[id]);
    if (result.rowCount > 0) {
      return result.rows[0];
    }
    return null;
  }

  async delete(id: number): Promise<void> {
    try {
      const sql = "DELETE FROM users WHERE id=$1";
      const conn = await Client.connect();
      await conn.query(sql, [id]);
      conn.release();
    } catch (error) {
      throw new Error(`Unable to delete user ${error}`);
    }
  }
}

import Client from "../database";
import bcrypt from "bcrypt";

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
      const conn = await Client.connect();
      const result = await conn.query(
        "SELECT id, firstname, lastname, email FROM users"
      );
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to get list of users ${error}`);
    }
  }

  async create(user: User): Promise<UserPreview> {
    try {
      const conn = await Client.connect();
      const pepper = process.env.BCRYPT_PASSWORD;
      const saltRounds = parseInt(process.env.SALT_ROUNDS as string);
      const hashedPassword = await bcrypt.hash(
        user.password + pepper,
        saltRounds
      );
      const result = await conn.query(
        "INSERT INTO users(email, firstname, lastname, password) VALUES ($1, $2, $3, $4) RETURNING id",
        [user.email, user.firstname, user.lastname, hashedPassword]
      );
      conn.release();
      return {
        ...result.rows[0],
        ...user
      };
    } catch (error) {
      throw new Error(`Unable to create user ${error}`);
    }
  }

  async authenticate(
    email: string,
    password: string
  ): Promise<UserPreview | null> {
    try {
      const conn = await Client.connect();
      const pepper = process.env.BCRYPT_PASSWORD;
      const result = await conn.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
      );
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
    const conn = await Client.connect();
    const result = await conn.query(
      "SELECT id, firstname, lastname, email FROM users WHERE id=$1",
      [id]
    );
    if (result.rowCount > 0) {
      return result.rows[0];
    }
    return null;
  }

  async delete(id?: number): Promise<void> {
    try {
      const conn = await Client.connect();
      if (id) {
        await conn.query("DELETE FROM users WHERE id=$1", [id]);
      } else {
        await conn.query("DELETE FROM users");
      }
      conn.release();
    } catch (error) {
      throw new Error(`Unable to delete user ${error}`);
    }
  }
}

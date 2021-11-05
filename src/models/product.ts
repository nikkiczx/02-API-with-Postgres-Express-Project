import Client from "../database";

export interface Product {
  id?: number;
  name: string;
  price: number;
}

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const sql = "SELECT * FROM products";
      const conn = await Client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to get products ${error}`);
    }
  }

  async create(product: Product): Promise<Product> {
    try {
      const sql = "INSERT INTO products(name, price) VALUES($1, $2) RETURNING id";
      const conn = await Client.connect();
      const result = await conn.query(sql, [product.name, product.price]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to create product ${error}`);
    }
  }

  async show(id: number): Promise<Product | null> {
    try {
      const sql = "SELECT * FROM products WHERE id=$1";
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rowCount > 0) {
        return result.rows[0];
      }
      return null;
    } catch (error) {
      throw new Error(`Unable to get product with id=($1) ${error}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const sql = "DELETE FROM products WHERE id=$1";
      const conn = await Client.connect();
      await conn.query(sql, [id]);
      conn.release();
    } catch (error) {
      throw new Error(`Unable to delete product ${error}`);
    }
  }
}

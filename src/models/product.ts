import Client from "../database";

export interface Product {
  id?: number;
  name: string;
  price: number;
}

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const result = await conn.query(
        "SELECT * FROM products"
      );
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to get products ${error}`);
    }
  }

  async create(product: Product): Promise<Product> {
    try {
      const conn = await Client.connect();
      const result = await conn.query(
        "INSERT INTO products(name, price) VALUES($1, $2) RETURNING id",
        [product.name, product.price]
      );
      conn.release();
      return {
        ...result.rows[0],
        ...product
      };
    } catch (error) {
      throw new Error(`Unable to create product ${error}`);
    }
  }

  async show(id: number): Promise<Product | null> {
    try {
      const conn = await Client.connect();
      const result = await conn.query(
        "SELECT * FROM products WHERE id=$1",
        [id]
      );
      conn.release();
      if (result.rowCount > 0) {
        return result.rows[0];
      }
      return null;
    } catch (error) {
      throw new Error(`Unable to get product ${error}`);
    }
  }

  async delete(id?: number): Promise<void> {
    try {
      const conn = await Client.connect();
      if (id) {
        await conn.query("DELETE FROM products WHERE id=$1", [
          id
        ]);
      } else {
        await conn.query("DELETE FROM products");
      }
      conn.release();
    } catch (error) {
      throw new Error(`Unable to delete product ${error}`);
    }
  }
}

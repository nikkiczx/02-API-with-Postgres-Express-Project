import Client from "../database";
import { Product } from "./product";

export type OrderProduct = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
};

export type OrderDetail = OrderProduct & Product;

export class OrderProductStore {
  async getProducts(orderId: number): Promise<OrderDetail[]> {
    try {
      const sql = "SELECT name, price, quantity FROM order_product INNER JOIN products ON products.id=order_product.product_id WHERE order_id=$1;";
      const conn = await Client.connect();
      const result = await conn.query(sql,[orderId]);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error("Unable to get products by ID");
    }
  }

  async create(orderProduct: OrderProduct): Promise<OrderProduct> {
    try {
      const sql = "INSERT INTO order_product(order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING id;"
      const conn = await Client.connect();
      const result = await conn.query(sql, [orderProduct.order_id, orderProduct.product_id, orderProduct.quantity]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to add product to order ${error}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const sql = "DELETE FROM order_product WHERE id=$1";
      const conn = await Client.connect();
      await conn.query(sql ,[id]);
      conn.release();
    } catch (error) {
      throw new Error(`Unable to delete order_product ${error}`);
    }
  }
}

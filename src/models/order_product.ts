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
  async getProductsByOrderId(orderId: number): Promise<OrderDetail[]> {
    try {
      const conn = await Client.connect();
      const result = await conn.query(
        "SELECT name, price, quantity FROM order_product INNER JOIN products ON products.id=order_product.product_id WHERE order_id=$1;",
        [orderId]
      );
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error("Unable to get products by its ID");
    }
  }

  async create(orderProduct: OrderProduct): Promise<OrderProduct> {
    try {
      const conn = await Client.connect();
      const result = await conn.query(
        "INSERT INTO order_product(order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING id;",
        [orderProduct.order_id, orderProduct.product_id, orderProduct.quantity]
      );
      conn.release();
      return {
        ...result.rows[0],
        ...orderProduct
      };
    } catch (error) {
      throw new Error(`Unable to add order_product ${error}`);
    }
  }

  async delete(id?: number): Promise<void> {
    try {
      const conn = await Client.connect();
      if (id) {
        await conn.query(
          "DELETE FROM order_product WHERE id=$1",
          [id]
        );
      } else {
        await conn.query("DELETE FROM order_product");
      }
      conn.release();
    } catch (error) {
      throw new Error(`Unable to delete order_product ${error}`);
    }
  }
}

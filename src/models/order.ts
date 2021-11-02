import Client from "../database";
import { QueryResult } from "pg";

export enum OrderStatusTypes {
  STATUS_ACTIVE,
  STATUS_COMPLETED
}

export type Order = {
  id?: number;
  user_id: number;
  status?: OrderStatusTypes;
};

export class OrderStore {
  async showOrdersByUserId(
    userId: number,
    status?: OrderStatusTypes
  ): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      let result: QueryResult<Order>;
      if (status || status === 0) {
        result = await conn.query(
          "SELECT * FROM orders WHERE user_id=$1 AND status=$2;",
          [userId, status]
        );
      } else {
        result = await conn.query(
          "SELECT * FROM orders WHERE user_id=$1;",
          [userId]
        );
      }
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to get list of orders by user ${error}`);
    }
  }

  async create(order: Order): Promise<Order> {
    try {
      const conn = await Client.connect();
      const result = await conn.query(
        "INSERT INTO orders(user_id) VALUES ($1) RETURNING id;",
        [order.user_id]
      );
      conn.release();
      return {
        ...result.rows[0],
        ...order
      };
    } catch (error) {
      throw new Error(`Unable to create order ${error}`);
    }
  }

  async orderCompleted(orderId: number) {
    try {
      const conn = await Client.connect();
      await conn.query("UPDATE orders SET status=1 WHERE id=$1;", [
        orderId
      ]);
      conn.release();
    } catch (error) {
      throw new Error(`Unable to set order as completed ${error}`);
    }
  }

  async delete(id?: number): Promise<void> {
    try {
      const conn = await Client.connect();
      if (id) {
        await conn.query("DELETE FROM orders WHERE id=$1", [id]);
      } else {
        await conn.query("DELETE FROM orders");
      }
      conn.release();
    } catch (error) {
      throw new Error(`Unable to delete order ${error}`);
    }
  }
}

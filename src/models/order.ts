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
  async show(
    userId: number,
    status?: OrderStatusTypes
  ): Promise<Order[]> {
    try {
      const sql = "SELECT * FROM orders WHERE user_id=$1 AND status=$2;";
      const conn = await Client.connect();
      let result: QueryResult<Order>;
      if (status || status === 0) {
        result = await conn.query(sql,[userId, status]);
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
      const sql = "INSERT INTO orders(user_id) VALUES ($1) RETURNING id;";
      const conn = await Client.connect();
      const result = await conn.query(sql,[order.user_id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to create order ${error}`);
    }
  }

  async orderCompleted(orderId: number) {
    try {
      const sql = "UPDATE orders SET status=1 WHERE id=$1;";
      const conn = await Client.connect();
      await conn.query(sql, [orderId]);
      conn.release();
    } catch (error) {
      throw new Error(`Unable to set order as completed ${error}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const sql = "DELETE FROM orders WHERE id=$1";
      const conn = await Client.connect();
      await conn.query(sql, [id]);
      conn.release();
    } catch (error) {
      throw new Error(`Unable to delete order ${error}`);
    }
  }
}

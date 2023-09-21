import * as mysql from "mysql2/promise";

class VeroCrud {
  private pool: mysql.Pool;
  private maxResults: number;

  constructor(
    username: string,
    password: string,
    database: string,
    host: string = "localhost"
  ) {
    this.pool = mysql.createPool({
      host: host,
      user: username,
      password: password,
      database: database,
    });
    this.maxResults = 20000; // Change as needed. If you have larger record sets increase this
  }

  private criteriaToString(
    // This function converts an array of arrays to an SQL
    // query critera. Expects each criteria to be in its
    // own 3 element array within the parent array. Default
    // is to join each of these with an AND statement. Setting
    // orOperand true replaces that with OR
    /* [
      [{
        field,      -- appropriate column name
        operand,    -- operator. =,<,>,LIKE
        value       -- value to compare
      }]
    ]
    */
    criteria: Array<Array<any>>,
    orOperand: boolean = false
  ): string {
    let returnStr = "(";
    let count = 0;
    const operand = orOperand ? "OR" : "AND";

    for (const item of criteria) {
      if (count > 0) {
        returnStr += ` ${operand} `;
      }
      returnStr += `${item[0]} ${item[1]}'`;

      if (item[1].toLowerCase() === "like") {
        returnStr += `%${item[2]}%'`;
      } else {
        returnStr += `${item[2]}'`;
      }

      count++;
    }

    return returnStr + ")";
  }

  async create(table: string, data: any): Promise<void> {
    // Creates a new entry in the database
    const connection = await this.pool.getConnection();
    try {
      await connection.query("INSERT INTO `table` SET ?", data);
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  }

  async read(
    table: string,
    criteria: Array<Array<string>>
  ): Promise<any | null> {
    // Performs a pretty flexible select statement coupled with
    // criteriaToString.
    const connection = await this.pool.getConnection();
    // Need to enumerate criteria for values
    try {
      const [rows] = await connection.query(
        "SELECT * FROM `" +
          table +
          " WHERE " +
          this.criteriaToString([["id", "=", 1]])
      );
      if (rows.length > 0) {
        return rows[0];
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  }

  async update(id: number, data: any): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.query("UPDATE your_table_name SET ? WHERE id = ?", [
        data,
        id,
      ]);
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  }

  async delete(id: number): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.query("DELETE FROM your_table_name WHERE id = ?", [id]);
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default VeroCrud;

import mysql from "mysql2/promise";

declare global {
  // Allow accessing `global` variable in TypeScript
  var mysqlPool: mysql.Pool | undefined;
}

function getPool(): mysql.Pool {
  if (!global.mysqlPool) {
    global.mysqlPool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      waitForConnections: true,
      connectionLimit: 10, // Adjust as needed
      queueLimit: 0,
    });
    console.log("MySQL pool created");
  }
  return global.mysqlPool;
}

type SqlParameter = string | number | boolean | null | Buffer | Date;

export async function query<T>(
  sql: string,
  params: SqlParameter[] = []
): Promise<T> {
  const pool = getPool();
  const [results] = await pool.execute(sql, params);
  return results as T;
}

export async function closePool(): Promise<void> {
  if (global.mysqlPool) {
    await global.mysqlPool.end();
    console.log("MySQL pool closed");
  }
}
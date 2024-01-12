import mysql from "mysql2/promise";

async function connectVectorDatabase() {
  const vectorDb = await mysql.createConnection({
    host: process.env.VECTOR_DATABASE_HOST,
    port: Number(process.env.VECTOR_DB_PORT),
    database: process.env.VECTOR_DATABASE_DB,
    user: process.env.VECTOR_DATABASE_USER,
    password: process.env.VECTOR_DATABASE_PASSWORD,
  });

  return vectorDb;
}

export { connectVectorDatabase };

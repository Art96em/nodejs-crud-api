import { pool } from "../utils/db";

export async function findUserByEmail(email: string) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  return result.rows[0];
}

export async function createUser(
  firstName: string,
  lastName: string,
  email: string,
  hash: string
) {
  const result = await pool.query(
    "INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *",
    [firstName, lastName, email, hash]
  );
  return result.rows[0];
}

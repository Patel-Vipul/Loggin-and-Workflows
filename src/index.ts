import http from "node:http";

import "dotenv/config";

import { pool } from "./app/db/pool.js";
import { expressApplication } from "./app/app.js";

async function main() {
  try {
    const PORT: Number = Number(process.env.PORT) || 3000;

    //creates a http server
    const server = http.createServer(expressApplication());

    //database connection
    const result = await  pool.query("SELECT NOW()")
    console.log("Database is connected successfully! ", result.rows[0])

    //server listening on port
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Server Error :: ", error)
    process.exit(1)
  }
}

main();

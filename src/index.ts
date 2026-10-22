import http from "node:http";

import "dotenv/config";
import { expressApplication } from "./app/app.js";

function main() {
  try {
    const PORT: Number = Number(process.env.PORT) || 3000;

    //creates a http server
    const server = http.createServer(expressApplication());

    //database connection

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

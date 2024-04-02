import "./style.css";

import { initDB } from "./duckdb.ts";

import type { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";

// Setup and connect to the database
let conn_prom: Promise<AsyncDuckDBConnection> | null; // Declare globally so promise can be awaited anywhere
const load_db = async () => {
  if (conn_prom) {
    return conn_prom; // Return existing promise, if any
  }

  // Initialize database
  const db = await initDB();

  await db.open({path: "http://localhost:5173/db/reservoir-analysis.db"});

  conn_prom = db.connect(); // Open a connection (promise)
  return conn_prom;
};

const query = `
  SELECT COUNT(*) AS total_measurements
  FROM measurements
`;

// Send query and await results from DuckDB
const get_query = async (q: string) => {
  const conn = await conn_prom;
  const results = await conn.query(q);
  return results;
};

const main = async () => {
  await load_db();
  const table = await get_query(query);
  // const table_arr = table.toArray();  
  const measurements = table.get(0).toJSON().total_measurements;
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div>
      <h1>Reservoir Analysis</h1>
      <div class="card">
        <span>Total Number of Measurements: ${measurements}</span>
      </div>
    </div>
  `;
};

main();
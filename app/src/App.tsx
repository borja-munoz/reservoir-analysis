import { useEffect, useState } from "react";
import "./App.css";

import { initDB } from "./db/duckdb";
import type { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";

let conn_prom: Promise<AsyncDuckDBConnection> | null; // Declare globally so promise can be awaited anywhere

const load_db = async () => {
  if (conn_prom) {
    return conn_prom; // Return existing promise, if any
  }

  // Initialize database
  const db = await initDB();

  await db.open({ path: "http://localhost:5173/db/reservoir-analysis.db" });

  conn_prom = db.connect(); // Open a connection (promise)
  return conn_prom;
};

function App() {
  const [measurements, setMeasurements] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
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

      await load_db();
      const table = await get_query(query);
      // const table_arr = table.toArray();
      setMeasurements(table.get(0).total_measurements);
    };

    fetchData();
  }, []);

  return (
    <>
      {measurements && (
        <div className="card">
          <p>Total Number of Measurements: {String(measurements)}</p>
        </div>
      )}
    </>
  );
}

export default App;

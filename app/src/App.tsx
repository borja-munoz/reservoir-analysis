import { useEffect, useState } from "react";
import "./App.css";

import { initDB } from "./db/duckdb";
import { DuckDBAccessMode, type AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";

let conn_prom: Promise<AsyncDuckDBConnection> | null; // Declare globally so promise can be awaited anywhere

const load_db = async () => {
  if (conn_prom) {
    return conn_prom; // Return existing promise, if any
  }

  // Initialize database
  const db = await initDB();

  await db.open({ 
    accessMode: DuckDBAccessMode.READ_ONLY,
    path: "http://localhost:5173/db/reservoir-analysis.db"
  });

  conn_prom = db.connect(); // Open a connection (promise)
  return conn_prom;
};

function App() {
  const [data, setData] = useState<any[]|undefined>([]);

  useEffect(() => {
    const fetchData = async () => {
      const query = `
        SELECT station_id, 
               station_name, 
               AVG(CAST(REPLACE(res_volume_hm3, ',', '.') AS FLOAT4)) AS res_volume_hm3,
               extract('year' FROM hour) AS year
        FROM measurements
        WHERE res_volume_hm3 IS NOT NULL
        GROUP BY station_id, station_name, year
        ORDER BY station_id, year
      `;

      // Send query and await results from DuckDB
      const get_query = async (q: string) => {
        const conn = await conn_prom;
        const results = await conn?.query(q);
        return results;
      };

      await load_db();
      const arrowTable = await get_query(query);

      console.log("Rows: " + arrowTable?.numRows);

      setData(arrowTable?.toArray());
    };

    fetchData();
  }, []);

  return (
    <>
      {data && (
        data.map(row => 
          <div className="card">
            <p>{row.station_id + " - " + row.station_name + " - " + row.res_volume_hm3 + " - " + row.year}</p>
          </div>
        )
      )}
    </>
  );
}

export default App;

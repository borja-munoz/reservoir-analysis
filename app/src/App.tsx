import { useEffect, useState } from "react";
import "./App.css";

import { initDB } from "./db/duckdb";
import type { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";
import { tableToIPC } from "apache-arrow";


import '@finos/perspective-viewer/dist/css/pro.css';
import '@finos/perspective-viewer';
import '@finos/perspective-viewer-datagrid';
import '@finos/perspective-viewer-d3fc';

import perspective from '@finos/perspective';
import { Table } from "@finos/perspective";

// Themes based on Thought Merchants's Prospective design
import "@finos/perspective-viewer/dist/css/pro.css";
import "@finos/perspective-viewer/dist/css/pro-dark.css";

// Other themes
import "@finos/perspective-viewer/dist/css/solarized.css";
import "@finos/perspective-viewer/dist/css/solarized-dark.css";
import "@finos/perspective-viewer/dist/css/monokai.css";
import "@finos/perspective-viewer/dist/css/vaporwave.css";

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
  const [data, setData] = useState<Table|null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // const query = `
      //   SELECT COUNT(*) AS total_measurements
      //   FROM measurements
      // `;
      const query = `
        SELECT station_id, 
               station_name, 
               AVG(CAST(REPLACE(res_volume_hm3, ',', '.') AS FLOAT4)) AS res_volume_hm3,
               extract('year' FROM hour) || '-' || extract('month' FROM hour) AS date
        FROM measurements
        WHERE res_volume_hm3 IS NOT NULL
        GROUP BY station_id, station_name, date
        ORDER BY station_id, date
      `;

      // Send query and await results from DuckDB
      const get_query = async (q: string) => {
        const conn = await conn_prom;
        const results = await conn.query(q);
        return results;
      };

      await load_db();
      const arrowTable = await get_query(query);
      // const table_arr = table.toArray();

      const ipcStream = tableToIPC(arrowTable, 'stream');
      const finosTable = await perspective.worker().table(ipcStream.buffer);

      const rows = await finosTable.num_rows();
      console.log("Rows: " + String(rows));

      setData(finosTable);
    };

    fetchData();
  }, []);

  const el = document.querySelector('perspective-viewer');

  if (el && data) {
    // await el.load(table);
    el.load(data);
    el.restore({ settings: true });
  }

  return (
    <>
      <perspective-viewer theme="Monokai"></perspective-viewer>
    </>
  );
}

export default App;

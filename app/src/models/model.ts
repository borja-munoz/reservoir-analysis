import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { executeQuery } from "../db/duckdb";

// Models are implemented as custom hooks
// to cache the query results using React Query

function useExecuteQuery(queryKeys: string[], query: string): UseQueryResult {
  return useQuery({
    queryKey: queryKeys,
    queryFn: async () => {
      const arrowTable = await executeQuery(query);
      // console.log("Rows: " + arrowTable?.numRows);
      return arrowTable;    
    },
  });  
}

export function useDefaultBasinMetric() {
  const query = `
    SELECT 'Hidrosur' as basin, year, volume_hm3
    FROM basin_reservoir_yearly_average
  `;
  return useExecuteQuery(
    ['defaultBasinMetric'],
    query
  );
}

export function useEntities() {
  const query = `
    SELECT id AS station_id,
          name AS station_name,
          province
    FROM stations
    ORDER BY province, name
  `;
  return useExecuteQuery(
    ['entities'],
    query
  );  
}
import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { executeQuery } from "../db/duckdb";
import { EntityType, SelectedEntity } from "../components/EntitySelector";

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
  return useExecuteQuery(["defaultBasinMetric"], query);
}

export function useEntities() {
  const query = `
    SELECT id AS station_id,
          name AS station_name,
          province
    FROM stations
    ORDER BY province, name
  `;
  return useExecuteQuery(["entities"], query);
}

export function useMetric(
  entity: SelectedEntity,
  table: string,
  column: string,
  timeStep: string
) {
  // ToDo: simple column average only works when the entity type
  // is station; if we have province or basin, we need to compute
  // the average of the sum of all stations in the province/basin
  const selectColumns = `
    AVG(${column})
  `;
  const whereClause =
    entity.type === EntityType.Province
      ? `WHERE province = '${entity.id}'`
      : entity.type === EntityType.Station
      ? `WHERE station_id = ${entity.id}`
      : "";
  const joinClause =
    entity.type === EntityType.Province
      ? `INNER JOIN stations s ON ${table}.station_id = s.id`
      : "";
  const query = `
    SELECT ${selectColumns} AS ${column},
           EXTRACT('${timeStep}' FROM hour) AS ${timeStep}
    FROM ${table}
    ${joinClause}
    ${whereClause}
    GROUP BY ${timeStep}
    ORDER BY ${timeStep}
  `;
  return useExecuteQuery(
    [entity.id, String(entity.idBasin), table, column, timeStep],
    query
  );
}

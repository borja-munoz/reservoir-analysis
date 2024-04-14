import { useQuery } from "@tanstack/react-query";

import { executeQuery } from "../db/duckdb";
import { EntityType, SelectedEntity } from "../components/EntitySelector";

// Models are implemented as custom hooks
// to cache the query results using React Query

function useExecuteQuery(queryKeys: string[], query: string) {
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

export function useStations(entity: SelectedEntity) {
  const whereClause =
    entity.type === EntityType.Province
      ? `WHERE province = '${entity.id}'`
      : entity.type === EntityType.Station
      ? `WHERE station_id = ${entity.id}`
      : "";
  const query = `
    SELECT id AS station_id,
           name AS station_name,
           province,
           type_description,
           type,
           subsystem,
           ST_X(geom_4326) AS latitude,
           ST_Y(geom_4326) AS longitude
    FROM stations
    ${whereClause}
    ORDER BY province, name
  `;
  return useExecuteQuery(["stations", entity.type, entity.id], query);
}

export function useMetric(
  entity: SelectedEntity,
  table: string,
  column: string,
  aggregation: string,
  timeStep: string
) {
  let query;

  const periodSelectColumn = 
    timeStep === "day"
      ? `STRFTIME(DATE_TRUNC('${timeStep}', hour), '%Y/%m/%d') AS ${timeStep}`
      : timeStep === "month"
      ? `STRFTIME(DATE_TRUNC('${timeStep}', hour), '%Y/%m') AS ${timeStep}`
      : `STRFTIME(DATE_TRUNC('${timeStep}', hour), '%Y') AS ${timeStep}`;

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

  if (aggregation === "AVG") {
    query = `
      SELECT AVG(${column}) AS ${column},
             ${periodSelectColumn}
      FROM ${table}
           ${joinClause}
      ${whereClause}
      GROUP BY DATE_TRUNC('${timeStep}', hour)
      ORDER BY ${timeStep}
    `;
  } else {
    query = `
      WITH hourly_data AS (
        SELECT SUM(${column}) AS ${column},
               hour
        FROM ${table}
             ${joinClause}
        ${whereClause}
        GROUP BY hour
      )
      SELECT AVG(${column}) AS ${column},
             ${periodSelectColumn}
      FROM hourly_data
      GROUP BY DATE_TRUNC('${timeStep}', hour)
      ORDER BY ${timeStep}
    `;
  }

  return useExecuteQuery(
    [entity.id, String(entity.idBasin), table, column, timeStep],
    query
  );
}

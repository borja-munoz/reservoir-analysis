CREATE OR REPLACE TABLE basin_reservoir_yearly_average AS
SELECT AVG(volume_hm3) AS volume_hm3,
       EXTRACT('year' FROM hour) AS year
  FROM measurements_reservoir
 GROUP BY year
 ORDER BY year;
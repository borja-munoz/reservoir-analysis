# Reservoir Analysis

## Goals

- Extract sensor data from [Hidrosur](http://www.redhidrosurmedioambiente.es/saih) and import it in a DuckDB database.

- Create a web app to query and visualize data in the browser using duckdb-wasm.

## Data Extraction

Hidrosur does not publish an API so we need to get the information in a different way.

The information will be stored in a DuckDB database.

The process will have 3 steps:

1. Create the master tables in the database
2. Download the CSV files with the hourly sensor data
3. Load the downloaded CSV files into the database

### Master tables

We can get a CSV file with the stations, including coordinates from this URL:

```
http://www.redhidrosurmedioambiente.es/saih/listado/estaciones
```

There are some stations with the same ID in the CSV file, so we need to remove the duplicates keeping the stations with measurements.

To get additional columns for the stations and the metadata for sensors, we can make a POST request to the following URL:

```
http://www.redhidrosurmedioambiente.es/saih/datos/a/la/carta/parametros --data-raw 'agrupacion=60&subsistema=&provincia=&tipoestacion=&estacion=&tipo=&sensor='
```

The response will be a JSON with all the stations and sensors available.

We can process this JSON response to update the stations and add the sensors.

### Download measurements

We can request hourly measurements for a single station using the following URL:

```
http://www.redhidrosurmedioambiente.es/saih/datos/a/la/carta/csv?datepickerini=16%2F03%2F2022+00%3A00&datepickerfin=16%2F03%2F2024+00%3A00&agrupacion=60&provincia=2&subsistema=subsistema+I1-I3&tipoestacion=&tipo=&estacion=16&sensor=
```

This will return a CSV file incorrectly formatted because there will be header lines in the middle of the file when there is data for a new sensor.

We can avoid this by requesting data for a single sensor each time. We will request data in 2-year intervals and write a file for each sensor and period.

```
http://www.redhidrosurmedioambiente.es/saih/datos/a/la/carta/csv?datepickerini=01%2F01%2F2018+00%3A00&datepickerfin=31%2F12%2F2019+23%3A00&agrupacion=60&provincia=2&subsistema=subsistema+I1-I3&tipoestacion=&tipo=&estacion=16&sensor=016E01
```

Downloading all the data from 2012/01/01 to 2024/03/17 took 54 min. and 5 sec.

### Data schema

The sensor ID is composed of:
- 3 digits indicating the station ID
- 1 letter indicating the sensor type
- 2 digits identifying the sensor measurement type (one sensor type like a meteorological station can have multiple types of measurements)

- Sensor Type: D (Nivel Tanque Evaporación - Evaporation Tank Level) -> 
  Estación;Nombre;Sensor;Fecha;Nombre;Nivel (mm);% Error

- Sensor Type: E (Embalse - Reservoir) -> 
  Estación;Nombre;Sensor;Fecha;Nivel (m.s.n.m.);Volumen (hm3)

- Sensor Type J -> Several sensors without data in station 272

- Sensor Type: K -> Error 270, 270K02

- Sensor Type: L (Embalse - Reservoir) -> 
  Estación;Nombre;Sensor;Fecha;Nivel (m.s.n.m.);Volumen (hm3)
  
- Sensor type: M (Meteorológica - Meteorological) -> 
  Estación;Nombre;Sensor;Fecha;Temperatura (ºC);% Error              -> 001M02
  Estación;Nombre;Sensor;Fecha;Presión atmosferica (mb);% Error      -> 007M03
  Estación;Nombre;Sensor;Fecha;Humedad relativa (%);% Error          -> 111M04
  Estación;Nombre;Sensor;Fecha;Velocidad del viento (km/h);% Error   -> 002M05
  Estación;Nombre;Sensor;Fecha;Dirección del viento (grados);% Error -> 058M06 
  Estación;Nombre;Sensor;Fecha;Radiación solar ('.W/m2.');% Error    -> 065M07

- Sensor Type: N (Nivómetro - Snowmeter) -> 
  Estación;Nombre;Sensor;Fecha;Nombre;Acumulado (l/m2)

- Sensor type: P (Pluviométrica - Pluviometer) -> 
  Estación;Nombre;Sensor;Fecha;Nombre;Acumulado (l/m2)

- Sensor type: R (Nivel de agua en río - River Water Level) -> 
  Estación;Nombre;Sensor;Fecha;Nivel (m.);% Error

### Load data 

We will load the data in the downloaded files into the database using the COPY command. We need to have one table per sensor type because the data has different attributes.

We will select the table where we copy the data based on the 4th char of the sensor id and, for meteorological stations (M), we will need to check also the last two digits.

Loading each table from the CSV files has taken ~5 minutes and 40 seconds.

Once we have loaded all the files, we will create one mega-table where we aggregate all the data, having one record per station and hour.

## Data Visualization

We will create a web application to visualize the data. We will have a UI for filtering and support for charts and maps. 

We will deploy the DuckDB database file to the web server. To open this file with duckdb-wasm we will follow the suggestions in this issue:

https://github.com/duckdb/duckdb-wasm/issues/1659

Some of the tools we can use to build the dashboard are:

- Evidence - Simple approach using SQL and Markdown but it converts everything to Parquet.

- Perspective.js - JavaScript charting library suited for large and streaming datasets.

## Data Analysis

It would be interesting to do some n-dimensional array analysis using NumPy or xarray.

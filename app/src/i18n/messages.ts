import { LOCALES } from "./locales";

export const messages = {

  [LOCALES.ENGLISH]: {

    // Homepage
    welcome: "Welcome to Reservoir Analysis!",

    // Header
    language: "Language",
    home: "Home",
    dashboard: "Dashboard",

    // Dashboard
    basin: "Basin",
    station_id: "Station ID",
    station_name: "Station Name",
    year: "Year",
    month: "Month",
    day: "Day",

    // Metrics
    metric: "Metric",
    reservoir: "Reservoir",
    res_volume: "Reservoir Volume",
    volume_hm3: "Volumen (hm3)",
    res_masl: "Reservoir - Meters above sea level",
    level_masl: "Level (masl)",
    river: "River",
    river_level: "River Level",
    level_m: "Level (m)",
    meteo: "Meteo",
    meteo_temperature: "Temperature",
    temperature_degc: "Temperature (ºC)",
    meteo_atm_pressure: "Atmospheric Pressure",
    atmospheric_pressure_mb: "Atmospheric Pressure (mb)",
    meteo_rel_humidity: "Relative Humidity",
    relative_humidity_pct: "Relative Humidity (%)",
    meteo_wind_speed: "Wind Speed",
    wind_speed_kmh: "Wind Speed (km/h)",
    meteo_wind_direction: "Wind Direction",
    wind_direction_deg: "Wind Direction (º)",
    meteo_solar_radiation: "Solar Radiation",
    solar_radiation_wm2: "Solar Radiation (w/m2)",
    pluviometry: "Pluviometry",
    pluviometry_acc_rain: "Accumulated Rain",
    accumulated_rain_lm2: "Accumulated Rain (l/m2)",
    snow: "Snow",
    snow_accumulated_snowfall: "Accumulated Snowfall",
    accumulated_snowfall_lm2: "Accumulated Snowfall (l/m2)",
    evaporation: "Evaporation",
    evaporation_tank_level: "Evaporation Tank Level",
    level_mm: "Level (mm)",

    // Time step
    yearly: "Yearly",
    monthly: "Monthly",
    daily: "Daily",
    hourly: "Hourly",

    // Advanced Examples
    price_display:
      "How {n, number, ::currency/USD} is displayed in your selected language",
    start_today: "Start Today: {d, date}",
  },

  [LOCALES.SPANISH]: {

    // Homepage
    welcome: "¡Bienvenido a Reservoir Analysis!",

    // Header
    language: "Idioma",
    home: "Inicio",
    dashboard: "Explorar",

    // Dashboard
    basin: "Cuenca",
    station_id: "ID Estación",
    station_name: "Nombre Estación",
    year: "Año",
    month: "Mes",
    day: "Día",

    // Metrics
    metric: "Métrica",
    reservoir: "Embalse",
    res_volume: "Volumen Embalse",
    volume_hm3: "Volumen (hm3)",
    res_masl: "Embalse - Metros sobre el nivel del mar",
    level_masl: "Nivel (msnm)",
    river: "Río",
    river_level: "Nivel Río",
    level_m: "Nivel (m)",
    meteo: "Meteo",
    meteo_temperature: "Temperatura",
    temperature_dgc: "Temperatura (ºC)",
    meteo_atm_pressure: "Presión Atmosférica",
    atmospheric_pressure_mb: "Presión Atmosférica (mb)",
    meteo_rel_humidity: "Humedad Relativa",
    relative_humidity_pct: "Humedad Relativa (%)",
    meteo_wind_speed: "Velocidad del Viento",
    wind_speed_kmh: "Velocidad del Viento (km/h)",
    meteo_wind_direction: "Dirección del Viento",
    wind_direction_deg: "Dirección del Viento (º)",
    meteo_solar_radiation: "Radiación Solar",
    solar_radiation_wm2: "Radiación Solar (w/m2)",
    pluviometry: "Pluviometría",
    pluviometry_acc_rain: "Lluvia Acumulada",
    accumulated_rain_lm2: "Lluvia Acumulada (l/m2)",
    snow: "Nieve",
    snow_accumulated_snowfall: "Nieve Acumulada",
    accumulated_snowfall_lm2: "Nieve Acumulada (l/m2)",
    evaporation: "Evaporación",
    evaporation_tank_level: "Nivel Tanque Evaporación",
    level_mm: "Nivel (mm)",

    // Time step
    yearly: "Anual",
    monthly: "Mensual",
    daily: "Diario",
    hourly: "Horario",
    
    // Advanced Examples
    price_display:
      "Comment {n, number, ::currency/USD} $ s'affiche dans la langue sélectionnée",
    start_today: "Commencez aujourd'hui: {d, date}",
  },

};
import { LOCALES } from "./locales";

export const messages = {

  [LOCALES.ENGLISH]: {

    // Homepage
    welcome: "Welcome to Reservoir Analysis!",

    // Header
    language: "Language",

    // Dashboard
    station_id: "Station ID",
    station_name: "Station Name",
    year: "Year",
    volume: "Volume",

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

    // Dashboard
    station_id: "ID Estación",
    station_name: "Nombre Estación",
    year: "Año",
    volume: "Volumen",
    
    // Advanced Examples
    price_display:
      "Comment {n, number, ::currency/USD} $ s'affiche dans la langue sélectionnée",
    start_today: "Commencez aujourd'hui: {d, date}",
  },

};
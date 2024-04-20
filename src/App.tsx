import { Suspense, useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import routes from "./routes";

import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import theme from "./theme";

import { IntlProvider } from "react-intl";
import { messages } from "./i18n/messages";

import { useSelector } from "react-redux";
import { RootState } from "./store/store";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { loadDB } from "./db/duckdb";
const queryClient = new QueryClient();

function App() {
  const locale = useSelector((state: RootState) => state.app.locale);
  const routing = useRoutes(routes);
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const initializeDB = async () => {
      await loadDB();
      setDbInitialized(true);
    };
    initializeDB();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <IntlProvider
          // @ts-ignore
          messages={messages[locale]}
          locale={locale}
          defaultLocale={locale}
        >
          <CssBaseline />
          {dbInitialized && (
            <Suspense fallback={<div>...</div>}>{routing}</Suspense>
          )}
        </IntlProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

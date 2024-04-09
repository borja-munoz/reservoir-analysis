import { Suspense } from "react";
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
const queryClient = new QueryClient();

function App() {
  const locale = useSelector((state: RootState) => state.app.locale);
  const routing = useRoutes(routes);

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <IntlProvider
          messages={messages[locale]}
          locale={locale}
          defaultLocale={locale}
        >
          <CssBaseline />
          <Suspense fallback={<div>...</div>}>{routing}</Suspense>
        </IntlProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

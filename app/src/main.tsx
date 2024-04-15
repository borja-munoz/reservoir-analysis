import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store";
import { HashRouter } from "react-router-dom";

import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
);

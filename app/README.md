# SAIH Explorer - Web Application

Data explorer with in-process OLAP database, using sensor data from the **S**istema **A**utomático de **I**nformación *H*idrológica (Hidrology Information System).

## Tech Stack

### Programming Language

[TypeScript](https://www.typescriptlang.org)

### Frontend

- UI Library: [React](https://react.dev)
- Tooling: [Vite](https://vitejs.dev)
- State Management: [Redux Toolkit](https://redux-toolkit.js.org/)
- Component Library: [Material-UI](https://mui.com/material-ui/)
- Client-Side Routing: [React Router](https://reactrouter.com/en/main)
- Query Caching: [React Query](https://tanstack.com/query)
- Internationalization: [React Intl](https://formatjs.io/docs/react-intl/)
- Map visualization: [deck.gl](https://deck.gl)

### Backend

In the beginning this is going to be a public application so no need for authentication/authorization for now.

We are going to use an in-process analytical SQL database for the browser, [DuckDB-Wasm](https://duckdb.org), with a web assembly engine so no need for any kind of backend API because the queries will be executed directly within the web browser.


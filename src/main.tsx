import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./i18n.ts";
import { ConfigProvider } from "antd";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { LandingPage } from "./pages/LandingPage.tsx";
import { PlayPage } from "./pages/PlayPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "play",
    element: <PlayPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#128EDB",
            colorSplit: "#808080",
          },
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
  </React.StrictMode>,
);

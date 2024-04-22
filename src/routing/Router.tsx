import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom";
import { MainLayout } from "../layout/MainLayout.tsx";
import { StartPage } from "../pages/StartPage.tsx";
import { SessionPage } from "../pages/SessionPage.tsx";
import { Routes } from "./Routes.ts";

export const Router = createBrowserRouter(
  createRoutesFromElements([
    <Route key={'root'} path={'/'}>
      <Route path={Routes.Home} element={<Navigate to={"start"} replace />} />,
    </Route>,
    <Route key={'mainLayout'} element={<MainLayout />} >
      <Route path={Routes.Start} element={<StartPage />} />
      <Route path={Routes.Session(':sessionId')} element={<SessionPage />} />
    </Route>]));

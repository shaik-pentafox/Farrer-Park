import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShellLayout } from "./layouts/AppShellLayout";
import Dashboard from "./pages/Dashboard2";
import DashboardMain from "./pages/DashboardMain";

export const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShellLayout />}>
          {/* <Route path="/" element={<DashboardMain />} />
          <Route path="/appoint" element={<Appoint />} /> */}
          <Route path="/">
            <Route index element={<DashboardMain />} />
            <Route path=":id" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

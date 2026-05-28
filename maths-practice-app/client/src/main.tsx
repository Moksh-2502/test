import React from "react";
import ReactDOM from "react-dom/client";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { AuthProvider } from "./components/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AbacusLevelsPage } from "./pages/AbacusLevelsPage";
import { AdminPage } from "./pages/AdminPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { MultiplayerPage } from "./pages/MultiplayerPage";
import { PracticePage } from "./pages/PracticePage";
import { RegisterPage } from "./pages/RegisterPage";
import { VedicModulesPage } from "./pages/VedicModulesPage";
import "./styles/main.css";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [{
      element: <AppLayout />,
      children: [
        { path: "/dashboard", element: <DashboardPage /> },
        { path: "/abacus", element: <AbacusLevelsPage /> },
        { path: "/vedic", element: <VedicModulesPage /> },
        { path: "/practice/:section/:moduleId", element: <PracticePage /> },
        { path: "/multiplayer", element: <MultiplayerPage /> }
      ]
    }]
  },
  {
    element: <ProtectedRoute admin />,
    children: [{ element: <AppLayout />, children: [{ path: "/admin", element: <AdminPage /> }] }]
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

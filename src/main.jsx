import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/user/LandingPage";
import RegisterUserLayout from "./pages/user/RegisterUserLayout";
import LoginForm from "./components/RegisterUserPage/LoginForm";
import RegisterForm from "./components/RegisterUserPage/RegisterForm";
import VerifyForm from "./components/RegisterUserPage/VerifyForm";
import AppPage from "./pages/user/AppPage";
import ChatPage from "./pages/user/ChatPage";
import SettingsPage from "./pages/user/SettingsPage";
import ProfilePage from "./components/SettingsPage/ProfilePage";
import AccountPage from "./components/SettingsPage/AccountPage";
import BlockedPage from "./components/SettingsPage/BlockedPage";
import PaymentPage from "./components/SettingsPage/PaymentPage";
import NotFoundPage from "./pages/user/NotFoundPage";
import AdminMainPage from "./pages/admin/AdminMainPage";
import AdminDashboardPage from "./components/AdminPage/AdminDashboardPage";
import AdminServerPage from "./components/AdminPage/AdminServer/AdminServerPage";
import AdminProviderPage from "./components/AdminPage/AdminProvider/AdminProviderPage";
import AdminCallLogPage from "./components/AdminPage/AdminCallLog/AdminCallLogPage";
import AdminReportsPage from "./components/AdminPage/AdminReports/AdminReportsPage";
import AdminUsersPage from "./components/AdminPage/AdminUsers/AdminUsersPage";
import { Toaster } from "react-hot-toast";
import { SoundProvider } from 'react-sounds';
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import AdminPrivateRoute from "./components/PrivateRoute/AdminPrivateRoute";
import "./index.css";
const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  {
    path: "/auth",
    element: <RegisterUserLayout />,
    children: [
      { index: true, element: <LoginForm /> },
      { path: "login", element: <LoginForm /> },
      { path: "register", element: <RegisterForm /> },
      { path: "verify", element: <VerifyForm /> },
    ],
  },
  { path: "/test", element: <AppPage /> },

  {
    path: "/chat",
    children: [
      { index: true, element: <PrivateRoute><ChatPage /></PrivateRoute> },
      {
        path: "settings",
        element: <PrivateRoute> <SettingsPage></SettingsPage>  </PrivateRoute>,
        children: [
          { index: true, element: <ProfilePage /> },
          { path: "account", element: <AccountPage /> },
          { path: "payment", element: <PaymentPage /> },
        ],
      },
    ],
  },


  {
    path: "/admin",
    element: <AdminPrivateRoute><AdminMainPage /></AdminPrivateRoute>,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "server", element: <AdminServerPage /> },
      { path: "provider", element: <AdminProviderPage /> },
      { path: "logs", element: <AdminCallLogPage /> },

      { path: "reports", element: <AdminReportsPage /> },
      { path: "users", element: <AdminUsersPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> }


  /*,
  { path: "/profile/:userid", element: <UserProfilePage /> },
  { path: "/call", element: <CallPage /> },
  { path: "/admin", element: <AdminMainPage /> },
  { path: "/admin/server", element: <AdminServerPage /> },
  { path: "/admin/provider", element: <AdminProviderPage /> },
  { path: "/admin/reports", element: <AdminReportsPage /> },
  { path: "/admin/users", element: <AdminUsersPage /> },
  { path: "/admin/calls", element: <AdminCallsPage /> },
  { path: "/admin/settings", element: <AdminSettingsPage /> },*/
]);
document.title = "One2One";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SoundProvider poolSize={10}>
      <>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "white",
              border: "1px solid #e0e5eb",
              color: "#1f2937",
              fontSize: "15px",
              fontWeight: "550",
              borderRadius: "10px",
            },
          }}
        />
        <RouterProvider router={router} />
      </>
    </SoundProvider>
  </StrictMode>
);
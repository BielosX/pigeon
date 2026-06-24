import "./App.css";
import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Login } from "./pages/Login";
import { Root } from "./components/Root";
import { SystemInfo } from "./pages/SystemInfo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "react-oidc-context";

const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        element: <Navigate to="/systemInfo" replace />,
      },
      {
        path: "systemInfo",
        Component: SystemInfo,
      },
    ],
  },
]);

const queryClient = new QueryClient();
const oidcConfig = {
  authority: import.meta.env.VITE_AUTHORITY,
  client_id: "pigeon",
  redirect_uri: import.meta.env.VITE_REDIRECT_URL,
  response_type: "code",
  scope: "openid profile email",
  automaticSilentRenew: true,
  loadUserInfo: true,
};

function App() {
  return (
    <AuthProvider
      onSigninCallback={() => {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      }}
      {...oidcConfig}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;

import "./App.css";
import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Login } from "./pages/Login";
import { Root } from "./components/Root.tsx";
import { SystemInfo } from "./pages/SystemInfo.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: Root,
    errorElement: <Navigate to="/" replace />,
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;

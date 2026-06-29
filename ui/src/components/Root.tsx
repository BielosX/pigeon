import {
  isRouteErrorResponse,
  Navigate,
  Outlet,
  useNavigate,
  useRouteError,
} from "react-router";
import { ToastContainer } from "react-toastify";
import { useAuth } from "react-oidc-context";
import { Layout } from "./Layout.tsx";
import { Paper } from "./Paper.tsx";

export const Root = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  if (auth.isLoading || auth.activeNavigator) {
    return (
      <div className="flex flex-row justify-center items-center">
        <span className="loading loading-spinner text-primary loading-xl" />
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="shadow-md p-8 w-1/5 rounded-md bg-white flex flex-col justify-center items-center">
          <div className="pb-6 text-2xl font-light text-error">Auth Error</div>
          <div className="text-error">{auth.error.name}</div>
          <div className="text-error">{auth.error.message}</div>
          <button
            className="btn btn-primary w-full mt-8"
            onClick={() => navigate("/login")}
          >
            Back to Log-in
          </button>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <Layout>
      <ToastContainer autoClose={1000} />
      <div className="flex flex-row justify-center">
        <div className="w-4/5 bg-white p-8 shadow-sm">
          <Outlet />
        </div>
      </div>
    </Layout>
  );
};

const RouteError = () => {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <span>
        {error.status} {error.statusText}
      </span>
    );
  }
  if (error instanceof Error) {
    return <span>{error.message}</span>;
  }
  return <span>Unknown error</span>;
};

export const RootErrorBoundary = () => {
  return (
    <Layout>
      <div className="size-full flex justify-center items-center">
        <Paper>
          <RouteError />
        </Paper>
      </div>
    </Layout>
  );
};

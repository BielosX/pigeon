import { Bird } from "lucide-react";
import { Navigate, Outlet, useNavigate } from "react-router";
import { ToastContainer } from "react-toastify";
import { useAuth } from "react-oidc-context";

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
  const onLogoClick = () => {
    navigate("/");
  };
  const onLogout = async () => {
    await auth.signoutRedirect({
      post_logout_redirect_uri: `${window.location.origin}/login`,
    });
  };
  return (
    <div className="size-full">
      <div className="navbar bg-primary shadow-sm text-primary-content flex flex-row justify-between">
        <div className="btn btn-ghost" onClick={onLogoClick}>
          <Bird />
          <span className="text-xl">Pigeon</span>
        </div>
        <span className="btn btn-ghost" onClick={onLogout}>
          Log-Out
        </span>
      </div>
      <ToastContainer autoClose={1000} />
      <div className="flex flex-row justify-center">
        <Outlet />
      </div>
    </div>
  );
};

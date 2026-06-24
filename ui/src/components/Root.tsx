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
      <div>
        <span className="text-red-600">{JSON.stringify(auth.error)}</span>
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

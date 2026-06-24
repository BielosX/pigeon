import { Bird } from "lucide-react";
import { Outlet, redirect } from "react-router";
import { ToastContainer } from "react-toastify";

export const Root = () => {
  const onLogoClick = () => {
    redirect("/");
  };
  return (
    <div className="size-full">
      <div className="navbar bg-primary shadow-sm text-primary-content">
        <div className="btn btn-ghost flex flex-column" onClick={onLogoClick}>
          <Bird />
          <span className="text-xl">Pigeon</span>
        </div>
      </div>
      <ToastContainer autoClose={1000} />
      <div className="flex flex-row justify-center">
        <Outlet />
      </div>
    </div>
  );
};

import {
  Bird,
  ChartSpline,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "react-oidc-context";
import type { ReactNode } from "react";

interface LayoutProps {
  children?: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const auth = useAuth();
  const navigate = useNavigate();

  const onLogoClick = () => {
    navigate("/");
  };
  const onLogout = async () => {
    await auth.signoutRedirect({
      post_logout_redirect_uri: `${window.location.origin}/login`,
    });
  };

  return (
    <div className="w-screen h-screen drawer drawer-open">
      <input id="root-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="navbar w-full bg-primary border-b border-gray-500 text-primary-content flex flex-row justify-start items-center">
          <div className="btn btn-ghost" onClick={onLogoClick}>
            <Bird />
            <span className="text-xl">Pigeon</span>
          </div>
          <span className="btn btn-ghost ml-auto" onClick={onLogout}>
            Log-Out
          </span>
        </div>
        {children}
      </div>
      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="root-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        <div className="flex divider-solid border-r border-gray-500 pt-4 min-h-full bg-primary is-drawer-close:w-14 is-drawer-open:w-64">
          <ul className="menu w-full grow p-0">
            <li>
              <label
                htmlFor="root-drawer"
                aria-label="open sidebar"
                className="text-white is-drawer-close:tooltip is-drawer-close:tooltip-right"
              >
                <ChevronRight className="is-drawer-open:hidden" />
                <ChevronLeft className="is-drawer-close:hidden" />
              </label>
            </li>
            <li className="flex justify-center items-center">
              <button
                className="w-full text-white text-l is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="SystemInfo"
                onClick={() => navigate("/systemInfo")}
              >
                <Info />
                <span className="whitespace-nowrap is-drawer-close:hidden">
                  System Info
                </span>
              </button>
            </li>
            <li>
              <button
                className="w-full text-white text-l is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="SystemCharts"
                onClick={() => navigate("/systemCharts")}
              >
                <ChartSpline />
                <span className="whitespace-nowrap is-drawer-close:hidden">
                  System Charts
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

import { Bird } from "lucide-react";
import { useAuth } from "react-oidc-context";
import { Paper } from "../components/Paper.tsx";

export const Login = () => {
  const auth = useAuth();
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div className="flex flex-row justify-between items-center pb-10">
        <Bird className="text-accent size-10" />
        <span className="text-accent text-4xl font-bold">Pigeon</span>
      </div>
      <Paper>
        <span className="text-base-content pb-6 text-2xl font-light">
          Log In
        </span>
        <button
          className="btn btn-primary w-full"
          onClick={() => auth.signinRedirect()}
        >
          Continue with Keycloak
        </button>
      </Paper>
    </div>
  );
};

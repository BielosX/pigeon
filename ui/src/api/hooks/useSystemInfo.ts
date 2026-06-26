import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../queryKey.ts";
import { getSystemInfo } from "../queries/systemInfo.ts";
import {useAuth} from "react-oidc-context";

export const useSystemInfo = () => {
  const auth = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.systemInfo],
    queryFn: () => getSystemInfo(auth.user?.access_token ?? ""),
  });
};

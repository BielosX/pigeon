import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../queryKey.ts";
import { getSystemInfo } from "../queries/systemInfo.ts";

export const useSystemInfo = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.systemInfo],
    queryFn: getSystemInfo,
  });
};

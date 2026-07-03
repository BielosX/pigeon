import { useAuth } from "react-oidc-context";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../queryKey";
import {
  getPrometheusQueryRange,
  type PrometheusQueryRangeRequest,
} from "../queries/prometheus";

export const usePrometheusQueryRange = (
  params: PrometheusQueryRangeRequest,
) => {
  const auth = useAuth();
  return useQuery({
    queryKey: [
      QUERY_KEYS.prometheusQueryRange,
      params.query,
      params.start,
      params.end,
      params.step,
    ],
    queryFn: () =>
      getPrometheusQueryRange(auth.user?.access_token ?? "", params),
  });
};

import { useAuth } from "react-oidc-context";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../queryKey";
import {
  getPrometheusQueryRange,
  PrometheusError,
  type PrometheusMatrixResult,
  type PrometheusQueryRangeRequest,
  type PrometheusQueryResponse,
} from "../queries/prometheus";

export const usePrometheusQueryRange = (
  params: PrometheusQueryRangeRequest,
) => {
  const auth = useAuth();
  return useQuery<
    PrometheusQueryResponse<PrometheusMatrixResult>,
    PrometheusError
  >({
    queryKey: [
      QUERY_KEYS.prometheusQueryRange,
      params.query,
      params.start,
      params.end,
      params.step,
    ],
    retry: false,
    queryFn: () =>
      getPrometheusQueryRange(auth.user?.access_token ?? "", params),
  });
};

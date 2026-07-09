export interface PrometheusQueryRangeRequest {
  query: string;
  start: string;
  end: string;
  step: string;
}

export interface PrometheusMatrixResult {
  values: [number, string][];
}

export interface PrometheusData<T> {
  resultType: string;
  result: T[];
}

export interface PrometheusQueryResponse<T> {
  data: PrometheusData<T>;
}

export interface PrometheusErrorResponse {
  errorType: string;
  error: string;
}

export class PrometheusError extends Error {
  public errorType: string;
  constructor(message: string, errorType: string) {
    super(message);
    this.errorType = errorType;
  }
}

export const getPrometheusQueryRange = async (
  token: string,
  request: PrometheusQueryRangeRequest,
): Promise<PrometheusQueryResponse<PrometheusMatrixResult>> => {
  const response = await fetch(`/api/v1/prometheus/query_range`, {
    method: "POST",
    body: new URLSearchParams({
      query: request.query,
      start: request.start,
      end: request.end,
      step: request.step,
    }),
    headers: {
      ContentType: "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const r: PrometheusErrorResponse = await response.json();
    throw new PrometheusError(r.error, r.errorType);
  }
  return await response.json();
};

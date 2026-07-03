import { usePrometheusQueryRange } from "../../api/hooks/usePrometheusQueryRange.ts";
import { type ChangeEvent, useState } from "react";
import dayjs from "dayjs";
import { ThermalChart } from "./components/ThermalChart.tsx";

type DataRange = "5m" | "30m" | "1h" | "5h";
type TimeWindow = "30s" | "1m" | "5m";
type AggregationFunction = "avg_over_time" | "max_over_time";

interface ChartConfig {
  end: dayjs.Dayjs;
  range: DataRange;
  aggFunc: AggregationFunction;
  window: TimeWindow;
}

export const SystemCharts = () => {
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    end: dayjs(),
    range: "30m",
    aggFunc: "avg_over_time",
    window: "30s",
  });
  const { data, isLoading } = usePrometheusQueryRange({
    query: `${chartConfig.aggFunc}(node_thermal_zone_temp{job="kubernetes-pods"}[${chartConfig.window}])`,
    start: chartConfig.end.subtract(1, "hour").toISOString(),
    end: chartConfig.end.toISOString(),
    step: chartConfig.window,
  });

  const handleRangeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChartConfig({
      ...chartConfig,
      range: event.target.value as DataRange,
      end: dayjs(),
    });
  };

  const handleWindowChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChartConfig({
      ...chartConfig,
      window: event.target.value as TimeWindow,
      end: dayjs(),
    });
  };

  const handleFuncChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChartConfig({
      ...chartConfig,
      aggFunc: event.target.value as AggregationFunction,
      end: dayjs(),
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div className="join">
          <label className="input rounded-l-lg border-0 font-bold">Range</label>
          <input
            className="join-item btn"
            type="radio"
            name="data-range"
            value="5m"
            aria-label="5m"
            disabled={isLoading}
            checked={chartConfig.range === "5m"}
            onChange={handleRangeChange}
          />
          <input
            className="join-item btn"
            type="radio"
            name="data-range"
            value="30m"
            aria-label="30m"
            disabled={isLoading}
            checked={chartConfig.range === "30m"}
            onChange={handleRangeChange}
          />
          <input
            className="join-item btn"
            type="radio"
            name="data-range"
            value="1h"
            aria-label="1h"
            disabled={isLoading}
            checked={chartConfig.range === "1h"}
            onChange={handleRangeChange}
          />
          <input
            className="join-item btn"
            type="radio"
            name="data-range"
            value="5h"
            aria-label="5h"
            disabled={isLoading}
            checked={chartConfig.range === "5h"}
            onChange={handleRangeChange}
          />
        </div>
        <div className="join ml-10">
          <label className="input rounded-l-lg border-0 font-bold">
            Window
          </label>
          <input
            className="join-item btn"
            type="radio"
            name="window"
            value="30s"
            aria-label="30s"
            disabled={isLoading}
            checked={chartConfig.window === "30s"}
            onChange={handleWindowChange}
          />
          <input
            className="join-item btn"
            type="radio"
            name="window"
            value="1m"
            aria-label="1m"
            disabled={isLoading}
            checked={chartConfig.window === "1m"}
            onChange={handleWindowChange}
          />
          <input
            className="join-item btn"
            type="radio"
            name="window"
            value="5m"
            aria-label="5m"
            disabled={isLoading}
            checked={chartConfig.window === "5m"}
            onChange={handleWindowChange}
          />
        </div>
        <div className="join ml-10">
          <label className="input rounded-l-lg border-0 font-bold">
            Function
          </label>
          <input
            className="join-item btn"
            type="radio"
            name="agg-func"
            value="avg_over_time"
            aria-label="Avg"
            disabled={isLoading}
            checked={chartConfig.aggFunc === "avg_over_time"}
            onChange={handleFuncChange}
          />
          <input
            className="join-item btn"
            type="radio"
            name="agg-func"
            value="max_over_time"
            aria-label="Max"
            disabled={isLoading}
            checked={chartConfig.aggFunc === "max_over_time"}
            onChange={handleFuncChange}
          />
        </div>
      </div>
      {data && (
        <ThermalChart
          labels={data.data.result[0].values.map((v) => {
            const ts = dayjs(v[0]);
            return `${ts.hour()}:${ts.minute()}:${ts.second()}`;
          })}
          data={data.data.result[0].values.map((v) => Number(v[1]))}
        />
      )}
    </div>
  );
};

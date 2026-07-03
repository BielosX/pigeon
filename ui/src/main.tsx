import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Chart, registerables } from "chart.js";
import { StrictMode } from "react";

Chart.register(...registerables);

const setupMock = async () => {
  if (import.meta.env.VITE_ENABLE_MOCK === "true") {
    const { worker } = await import("./mocks/browser");
    console.info("MSW Enabled. Starting...");
    return worker.start({
      onUnhandledRequest: "bypass",
    });
  }
  console.info("MSW Disabled");
  return;
};

setupMock().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});

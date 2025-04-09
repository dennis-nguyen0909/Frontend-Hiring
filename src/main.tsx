import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store/store.ts";
import { IntlProvider } from "react-intl";
import enMessages from "./translations/Messages.ts";
import viMessages from "./translations/vi.json";
import "typeface-inter";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "../src/config/i18n.config.ts";
const messages = {
  en: enMessages,
  vi: viMessages,
};
const language = "vi"; // 'en', 'vi'
const queryClient = new QueryClient();
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <IntlProvider messages={messages[language]} locale={language}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
          <ToastContainer />
        </PersistGate>
      </Provider>
      {/* change api */}
    </IntlProvider>
  </QueryClientProvider>
  // </StrictMode>
);

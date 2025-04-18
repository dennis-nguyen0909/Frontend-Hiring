import { createRoot } from "react-dom/client";
// src/main.tsx
import "@fontsource/inter"; // sử dụng font Inter mặc định (400)
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
import { pdfjs } from "react-pdf";

type SupportedLanguages = "en" | "vi";

const messages: Record<SupportedLanguages, any> = {
  en: enMessages,
  vi: viMessages,
};

const detectLanguage = (): SupportedLanguages => {
  const saved = localStorage.getItem("lang");
  if (saved === "vi" || saved === "en") return saved;
  const browserLocale = navigator.language || navigator.languages[0] || "en";
  const lang = browserLocale.startsWith("vi") ? "vi" : "en";
  localStorage.setItem("lang", lang);
  return lang;
};

const language: SupportedLanguages = detectLanguage();

const queryClient = new QueryClient();

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
    </IntlProvider>
  </QueryClientProvider>
  // </StrictMode>
);

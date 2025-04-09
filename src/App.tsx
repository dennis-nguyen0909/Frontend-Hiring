import { Suspense, useEffect, useState } from "react";
import { routes } from "./routes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Fragment } from "react";
import DefaultPage from "./pages/default/DefaultPage";
import NotFound from "./components/NotFound/NotFound";
import LoadingPage from "./components/Loading/LoadingPage";
import { AuthGuard } from "./routes/guards";

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <Suspense fallback={<LoadingPage />}>
        {isLoading ? (
          <LoadingPage />
        ) : (
          <Routes>
            {routes.map((route) => {
              const Page = route.page;
              const Layout = route.isShowHeader ? DefaultPage : Fragment;

              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <AuthGuard route={route}>
                      <Layout showFooter={route.isShowFooter !== false}>
                        <Page />
                      </Layout>
                    </AuthGuard>
                  }
                />
              );
            })}
          </Routes>
        )}
      </Suspense>
    </Router>
  );
}

export default App;

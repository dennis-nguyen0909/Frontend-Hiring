import { Suspense, useEffect, useState } from "react";
import { routes } from "../src/routes/index";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Fragment } from "react";
import DefaultPage from "./pages/default/DefaultPage";
import NotFound from "./components/NotFound/NotFound";
import LoadingPage from "./components/Loading/LoadingPage";
function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  
  return (
    <div>
      {isLoading ? (
        <div>
          <LoadingPage />
        </div>
      ) : (
        <Router>
             <Suspense fallback={<LoadingPage />}>
              <Routes>
                {routes.map((route) => {
                  const Page = route.page;
                  const Layout = route.isShowHeader ? DefaultPage : Fragment;
                  return (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        <Layout showFooter={route.isShowFooter !== false}>
                          {route.isPrivate ? (
                            <NotFound />
                          ) : (
                            <Page />
                          )}
                        </Layout>
                      }
                    />
                  );
                })}
                <Route path="*" element={<NotFound />} />
              </Routes>
          </Suspense>
        </Router>
      )}
    </div>
  );
}

export default App;

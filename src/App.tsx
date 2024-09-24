import React, { useState } from 'react';
import { routes } from '../src/routes/index';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Fragment } from 'react';
import DefaultPage from './pages/default/DefaultPage';
import NotFound from './components/NotFound/NotFound';
function App() {
  const [isLoading,setIsLoading]=useState<boolean>(false);
  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page;
              const Layout = route.isShowHeader ? DefaultPage : Fragment;
              return (
                <Route key={route.path} path={route.path} element={
                  <Layout>
                    {route.isPrivate ? (
                      <NotFound />
                    ) : (
                      <Page />
                    )}
                  </Layout>
                }></Route >
              )
            })}
          </Routes >
        </Router >
      )}
    </div>
  );
}

export default App;

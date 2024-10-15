import React, { useEffect, useState } from 'react';
import { routes } from '../src/routes/index';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Fragment } from 'react';
import DefaultPage from './pages/default/DefaultPage';
import NotFound from './components/NotFound/NotFound';
import { useDispatch, useSelector } from 'react-redux';
import { axiosJWT } from './services/config/axiosConfig';
import { handleDecoded } from './helper';
import { getDetailUser, refreshToken } from './services'; // Assuming you have refreshToken in services
import { resetUser, updateUser } from './redux/slices/userSlices';
import  { JwtPayload,jwtDecode } from 'jwt-decode'; // Fix the import for jwtDecode

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const { token, decoded } = handleDecoded(accessToken);
      if (decoded?.sub) {
        handleGetDetailUser(decoded, token);
      }
    }
  }, []);

  const handleGetDetailUser = async (decoded: JwtPayload, access_token: string) => {
    try {
      const storage = localStorage.getItem('refresh_token');
      const res = await getDetailUser(decoded.sub + '', access_token);
      dispatch(updateUser({ ...res?.data.items, access_token: access_token, refresh_token: storage }));
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // axiosJWT.interceptors.request.use(
  //   async (config) => {
  //     try {
  //       const currentTime = new Date().getTime() / 1000; // current time in seconds
  //       const accessToken = localStorage.getItem("access_token");
  //       const decoded = handleDecoded(accessToken);
  
  //       console.log("current time:", currentTime);
  //       console.log("accessToken from localStorage:", accessToken);
  //       console.log("decoded:", decoded);
  
  //       let storage = localStorage.getItem("refresh_token");
  
  //       if (decoded?.exp && decoded.exp < currentTime) {
  //         console.log("Access token expired, checking refresh token...");
  
  //         if (storage) {
  //           const refreshToken = JSON.parse(storage);
  //           const decodedRefreshToken = jwtDecode(refreshToken);
  
  //           console.log("Decoded Refresh Token:", decodedRefreshToken);
  
  //           if (decodedRefreshToken?.exp && decodedRefreshToken.exp > currentTime) {
  //             console.log("Refresh token valid, refreshing access token...");
  //             const data = await refreshToken(refreshToken);
  
  //             console.log("New access token:", data?.access_token);
  //             config.headers["Authorization"] = `Bearer ${data?.access_token}`;
  //             localStorage.setItem('access_token', data?.access_token);
  //             dispatch(updateUser({ access_token: data?.access_token }));
  //           } else {
  //             console.log("Refresh token expired");
  //             dispatch(resetUser());
  //             localStorage.removeItem('access_token');
  //             localStorage.removeItem('refresh_token');
  //           }
  //         }
  //       } else {
  //         console.log("Access token still valid");
  //         config.headers["Authorization"] = `Bearer ${accessToken}`;
  //       }
  //     } catch (error) {
  //       console.error('Error in request interceptor:', error);
  //       dispatch(resetUser());
  //     }
  //     return config;
  //   },
  //   (err) => {
  //     return Promise.reject(err);
  //   }
  // );
  

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
                      // You can handle authentication logic here
                      <NotFound />
                    ) : (
                      <Page />
                    )}
                  </Layout>
                } />
              );
            })}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;

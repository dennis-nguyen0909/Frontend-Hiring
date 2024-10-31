import { useEffect, useState } from 'react';
import { routes } from '../src/routes/index';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Fragment } from 'react';
import DefaultPage from './pages/default/DefaultPage';
import NotFound from './components/NotFound/NotFound';
import { useDispatch } from 'react-redux';
import { handleDecoded } from './helper';
import { getDetailUser } from './services'; // Assuming you have refreshToken in services
import { resetUser, updateUser } from './redux/slices/userSlices';
import  { jwtDecode, JwtPayload } from 'jwt-decode'; // Fix the import for jwtDecode
import {axiosInstance} from './services/config/axiosConfig';
import * as  authServices from './services/modules/authServices'
function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const { token, decoded } = handleDecoded(accessToken);
      console.log("decoded",decoded)
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

  axiosInstance.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const accessToken = localStorage.getItem("access_token");
      const { decoded } = handleDecoded(accessToken);
      const storage = localStorage.getItem("refresh_token");
  
      if (!storage) {
        console.log("No refresh token found.");
        return config;
      }
  
      const decodedRefreshToken = jwtDecode(storage);
      console.log("Decoded Refresh Token:", decodedRefreshToken);
  
      if (decodedRefreshToken?.exp && decoded?.exp < currentTime.getTime() / 1000) {
        console.log("Access token expired, checking refresh token...");
  
        if (decodedRefreshToken.exp > currentTime.getTime() / 1000) {
          console.log("Refreshing token...");
          const data = await authServices.refreshToken(storage);
          config.headers["token"] = `Bearer ${data?.access_token}`;
        } else {
          console.log("Refresh token expired, resetting user.");
          dispatch(resetUser());
        }
      }
      return config;
    },
    function (err) {
      return Promise.reject(err);
    }
  );
  

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

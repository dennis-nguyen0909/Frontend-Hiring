import { useEffect, useState } from "react";
import { routes } from "../src/routes/index";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Fragment } from "react";
import DefaultPage from "./pages/default/DefaultPage";
import NotFound from "./components/NotFound/NotFound";
import { useDispatch } from "react-redux";
import { handleDecoded } from "./helper";
import { getDetailUser } from "./services"; // Assuming you have refreshToken in services
import { resetUser, updateUser } from "./redux/slices/userSlices";
import { jwtDecode, JwtPayload } from "jwt-decode"; // Fix the import for jwtDecode
import { axiosInstance } from "./services/config/axiosConfig";
import * as authServices from "./services/modules/authServices";
function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        const { token, decoded } = handleDecoded(accessToken);

        if (!decoded) return;

        if (decoded?.exp && decoded.exp < Date.now() / 1000000) {
          fetchRefreshToken();
        } else if (decoded?.sub) {
          handleGetDetailUser(decoded, token);
        }
      }
    };

    // Gọi hàm kiểm tra khi component mount
    checkTokenExpiration();

    // Thiết lập interval để kiểm tra token mỗi 5 phút (300,000 ms)
    const intervalId = setInterval(checkTokenExpiration, 10000);

    // Cleanup interval khi component bị unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchRefreshToken = async () => {
    const data = await authServices.refreshToken(
      localStorage.getItem("access_token") as string
    );
  };

  const handleGetDetailUser = async (
    decoded: JwtPayload,
    access_token: string
  ) => {
    try {
      const storage = localStorage.getItem("refresh_token");
      const res = await getDetailUser(decoded.sub + "", access_token);
      dispatch(
        updateUser({
          ...res?.data.items,
          access_token: access_token,
          refresh_token: storage,
        })
      );
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  axiosInstance.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const accessToken = localStorage.getItem("access_token");
      const { decoded } = handleDecoded(accessToken);
      const storage = localStorage.getItem("refresh_token");

      if (!storage) {
        return config;
      }

      const decodedRefreshToken = jwtDecode(storage);

      if (
        decodedRefreshToken?.exp &&
        decoded?.exp < currentTime.getTime() / 1000
      ) {

        if (decodedRefreshToken.exp > currentTime.getTime() / 1000) {
          const data = await authServices.refreshToken(storage);
          config.headers["token"] = `Bearer ${data?.access_token}`;
        } else {
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
        </Router>
      )}
    </div>
  );
}

export default App;

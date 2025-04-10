import { useState } from "react";
import { notification } from "antd";
import {
  BellOutlined,
  BookOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import OverViewCandidate from "./overview";
import Applied from "./applied";
import FavoriteJob from "./FavoriteJob";
import AlertJob from "./AlertJob";
import SettingCandidate from "./setting";
import * as authServices from "../../../services/modules/authServices";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetUser } from "../../../redux/slices/userSlices";
import { AlignJustify, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const DashboardCandidate = () => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState("overview");
  const [sidebarVisible, setSidebarVisible] = useState(false); // Trạng thái để quản lý sidebar
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleTabClick = (tab) => {
    setCurrentTab(tab);
    setSidebarVisible(false); // Ẩn sidebar sau khi chọn tab
  };

  const handleLogout = async () => {
    try {
      const res = await authServices.logout(user.access_token);
      if (res.data === true) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        dispatch(resetUser());
        navigate("/");
        notification.success({
          message: t("notification"),
          description: t("logout_success"),
        });
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: error.message,
      });
      console.error(t("logout_failed"), error);
    }
  };

  return (
    <>
      {/* Nút hiển thị sidebar */}
      <div className="md:hidden p-4 ml-2">
        <AlignJustify
          className="cursor-pointer"
          onClick={() => setSidebarVisible(!sidebarVisible)}
        />
      </div>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div
          className={`fixed md:relative top-0 left-0 bg-white shadow-md md:w-64 h-screen transform ${
            sidebarVisible ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
        >
          {/* Nút ẩn sidebar */}
          <div
            className="flex justify-between items-center"
            style={{ borderBottom: "1px solid #ccc" }}
          >
            <div className="p-4 text-xl font-bold text-center">
              {t("candidate")}
            </div>
            <div className="md:hidden flex justify-end p-4">
              <X onClick={() => setSidebarVisible(false)} />
            </div>
          </div>
          <nav className="mt-4 flex flex-col">
            <a
              href="#"
              className={`flex items-center px-4 py-3 w-full ${
                currentTab === "overview"
                  ? "text-blue-600 bg-blue-100"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => handleTabClick("overview")}
            >
              <FileTextOutlined className="mr-3" />
              {t("overview")}
            </a>
            <a
              href="#"
              className={`flex items-center px-4 py-3 w-full ${
                currentTab === "appliedJobs"
                  ? "text-blue-600 bg-blue-100"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => handleTabClick("appliedJobs")}
            >
              <FileTextOutlined className="mr-3" />
              {t("applied_jobs")}
            </a>
            <a
              href="#"
              className={`flex items-center px-4 py-3 w-full ${
                currentTab === "favoriteJobs"
                  ? "text-blue-600 bg-blue-100"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => handleTabClick("favoriteJobs")}
            >
              <BookOutlined className="mr-3" />
              {t("favorite_jobs")}
            </a>
            <a
              href="#"
              className={`flex items-center px-4 py-3 w-full ${
                currentTab === "jobAlert"
                  ? "text-blue-600 bg-blue-100"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => handleTabClick("jobAlert")}
            >
              <BellOutlined className="mr-3" />
              {t("job_alert")}
              <span className="ml-auto bg-blue-500 text-white text-xs px-2 rounded-full">
                09
              </span>
            </a>
            <a
              href="#"
              className={`flex items-center px-4 py-3 w-full ${
                currentTab === "settings"
                  ? "text-blue-600 bg-blue-100"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => handleTabClick("settings")}
            >
              <SettingOutlined className="mr-3" />
              {t("settings")}
            </a>
          </nav>
          <div
            className="flex items-center text-gray-700 px-4 py-3 md:absolute md:bottom-4"
            onClick={handleLogout}
          >
            <LogoutOutlined className="mr-2" />
            {t("logout")}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-20 py-5 overflow-auto">
          {currentTab === "overview" && <OverViewCandidate userDetail={user} />}
          {currentTab === "appliedJobs" && <Applied />}
          {currentTab === "favoriteJobs" && <FavoriteJob />}
          {currentTab === "jobAlert" && <AlertJob />}
          {currentTab === "settings" && <SettingCandidate />}
        </div>
      </div>
    </>
  );
};

export default DashboardCandidate;

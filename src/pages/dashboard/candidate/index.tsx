import { useState, useEffect } from "react";
import { notification } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetUser } from "../../../redux/slices/userSlices";
import {
  AlignJustify,
  Bookmark,
  BriefcaseBusiness,
  Eye,
  FileText,
  LayoutDashboard,
  SettingsIcon,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import * as authServices from "../../../services/modules/authServices";
import OverViewCandidate from "./overview";
import Applied from "./applied";
import FavoriteJob from "./FavoriteJob";
import ViewedJob from "./ViewedJob/ViewedJob";
import SettingCandidate from "./setting";
import MyCV from "./MyCV/MyCV";

const DashboardCandidate = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("activeTab") || "overview"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useSelector((state: any) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const tab = searchParams.get("activeTab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
    navigate(`/dashboard/candidate?activeTab=${tab}`);
  };

  const logout = async () => {
    try {
      if (await authServices.logout(user.access_token)) {
        localStorage.clear();
        dispatch(resetUser());
        navigate("/");
        notification.success({
          message: t("notification"),
          description: t("logout_success"),
        });
      }
    } catch (error: any) {
      notification.error({
        message: t("notification"),
        description: error.message,
      });
      console.error(t("logout_failed"), error);
    }
  };

  const tabs = [
    {
      key: "overview",
      label: t("overview"),
      icon: <LayoutDashboard className="mr-3" />,
      component: (
        <OverViewCandidate
          userDetail={user}
          onViewAppliedJob={() => handleTabChange("appliedJobs")}
          handleViewFavoriteJob={() => handleTabChange("favoriteJobs")}
          handleViewedJob={() => handleTabChange("viewedJobs")}
        />
      ),
    },
    {
      key: "appliedJobs",
      label: t("applied_jobs"),
      icon: <BriefcaseBusiness className="mr-3" />,
      component: <Applied />,
    },
    {
      key: "favoriteJobs",
      label: t("favorite_jobs"),
      icon: <Bookmark className="mr-3" />,
      component: <FavoriteJob />,
    },
    {
      key: "viewedJobs",
      label: t("job_seen"),
      icon: <Eye className="mr-3" />,
      component: <ViewedJob />,
    },
    {
      key: "mycv",
      label: t("mycv"),
      icon: <FileText className="mr-3" />,
      component: <MyCV />,
    },
    {
      key: "settings",
      label: t("settings"),
      icon: <SettingsIcon className="mr-3" />,
      component: <SettingCandidate />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="md:hidden p-4 ml-2">
        <AlignJustify
          className="cursor-pointer"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>
      <aside
        className={`fixed md:relative top-0 left-0 bg-white shadow-md md:w-64 h-screen transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="flex justify-between items-center border-b p-4">
          <span className="text-xl font-bold text-center w-full">
            {t("candidate")}
          </span>
          <X
            className="md:hidden cursor-pointer"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
        <nav className="mt-4 flex flex-col">
          {tabs?.map((tab) => (
            <a
              key={tab.key}
              href="#"
              className={`flex items-center px-4 py-3 w-full ${
                activeTab === tab.key
                  ? "text-blue-600 bg-blue-100"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => handleTabChange(tab.key)}
            >
              {tab.icon}
              {tab.label}
            </a>
          ))}
        </nav>
        <div
          className="flex items-center text-gray-700 px-4 py-3 md:absolute md:bottom-4 cursor-pointer"
          onClick={logout}
        >
          <LogoutOutlined className="mr-2" />
          {t("logout")}
        </div>
      </aside>
      <main className="flex-1 px-20 py-5 overflow-auto">
        {tabs.find((tab) => tab.key === activeTab)?.component}
      </main>
    </div>
  );
};

export default DashboardCandidate;

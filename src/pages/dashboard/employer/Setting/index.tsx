import { useEffect, useState } from "react";
import { Tabs } from "antd";
import {
  UserOutlined,
  GlobalOutlined,
  WifiOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import CompanyInfo from "./Company";
import Founding from "./Founding";
import SocialEmployer from "./Social";
import AccountSettingEmployer from "./Account";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./style.css";
export default function SettingEmployer() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("company_info");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const tab = searchParams.get("tabChild");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const tabItems = [
    {
      key: "company_info",
      label: (
        <span className="!text-black flex items-center gap-2">
          <UserOutlined />
          {t("company_info")}
        </span>
      ),
      content: <CompanyInfo />,
    },
    {
      key: "founding_info",
      label: (
        <span className="!text-black flex items-center gap-2">
          <GlobalOutlined />
          {t("founding_info")}
        </span>
      ),
      content: <Founding />,
    },
    {
      key: "social_info",
      label: (
        <span className="!text-black flex items-center gap-2">
          <WifiOutlined />
          {t("social_info")}
        </span>
      ),
      content: <SocialEmployer />,
    },
    {
      key: "account_setting",
      label: (
        <span className="!text-black flex items-center gap-2">
          <SettingOutlined />
          {t("account_setting")}
        </span>
      ),
      content: <AccountSettingEmployer />,
    },
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    navigate(`/dashboard/employer?activeTab=settings&tabChild=${key}`);
  };

  return (
    <div className="setting-employer bg-gray-50 min-h-screen mx-2">
      <div className="mx-auto">
        <h1 className="text-2xl font-semibold mb-6">{t("setting")}</h1>
        <div className="bg-white rounded-lg shadow-sm">
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={tabItems.map(({ key, label }) => ({
              key,
              label,
            }))}
            className="px-6 pt-4 !text-primaryColor"
          />
          <div className="p-6">
            {tabItems.find((item) => item.key === activeTab)?.content}
          </div>
        </div>
      </div>
    </div>
  );
}

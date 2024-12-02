import { useEffect, useState } from "react";
import { Button, Progress } from "antd";
import CompanyInfo from "./CompanyInfo";
import FoundingInfo from "./FoundingInfo";
import SocialLinks from "./SocialLinks";
import Contact from "./Contact";
import Completed from "./Completed";
import { USER_API } from "../../../services/modules/userServices";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AccountSetup() {
  const [activeTab, setActiveTab] = useState("company");
  const userDetail = useSelector(state=>state.user)
  const [checkField,setCheckField]=useState()
  const handleTabChange = (id: string) => {
    setActiveTab(id);
    handleCheckUpdate();
  };
  const navigate =useNavigate()
  const handleComplete = () => {
    setActiveTab("completed");
  };
  const tabs = [
    { id: "company", label: "Company Info", content: <CompanyInfo handleTabChange={handleTabChange} /> },
    { id: "founding", label: "Founding Info", content: <FoundingInfo  handleTabChange={handleTabChange}  /> },
    { id: "social", label: "Social Media Profile", content: <SocialLinks  handleTabChange={handleTabChange} /> },
    {
      id: "contact",
      label: "Contact",
      content: <Contact handleTabChange={handleTabChange} />,
    },
  ];

  const progress = (tabs.findIndex((tab) => tab.id === activeTab) + 1) * 25;

  
  const handleCheckUpdate = async () => {
    if (userDetail?.role?.role_name === "EMPLOYER") {
      try {
        if (userDetail?._id && userDetail?.access_token) {
          const res = await USERs_API.checkUpdateCompany(userDetail?._id, userDetail?.access_token);
          if (res.data) {
            const { company_info, contact, founding_info, social_info } = res.data.progress_setup;
            setCheckField(res.data.progress_setup);

            // Check for incomplete setup and update activeTab accordingly
            if (!company_info) {
              setActiveTab("company");
            } else if (!founding_info) {
              setActiveTab("founding");
            } else if (!social_info) {
              setActiveTab("social");
            } else if (!contact) {
              setActiveTab("contact");
            } else {
              navigate("/");
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    if (userDetail && userDetail._id && userDetail.access_token) {
      handleCheckUpdate();
    }
  }, [userDetail]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {activeTab !== "completed" && (
        <>
          <div className="bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold">Account Setup</h1>
            <Progress percent={progress} showInfo={false} className="mt-4" />
          </div>
          <div className="flex justify-around bg-white p-4 border-b">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                type={activeTab === tab.id ? "primary" : "default"}
                onClick={() => handleTabChange(tab.id)}
                disabled={tab.id === "company" && checkField?.company_info || tab.id === "founding" && checkField?.founding_info ||  tab.id === "social" && checkField?.social_info ||  tab.id === "contact" && checkField?.contact }
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </>
      )}
      <div className="p-6">
        {activeTab === "completed" ? (
          <Completed />
        ) : (
          tabs.find((tab) => tab.id === activeTab)?.content
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import { useSelector } from "react-redux";
import { getDetailUser, USER_API } from "../../services/modules/userServices";
import AccountSetup from "../auth/Account/SetupEmployer";
import { Modal, notification } from "antd";
import CompanyInfo from "../auth/Account/CompanyInfo";
import FoundingInfo from "../auth/Account/FoundingInfo";
import SocialLinks from "../auth/Account/SocialLinks";
import Contact from "../auth/Account/Contact";
import Completed from "../auth/Account/Completed";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slices/userSlices";
import { User } from "lucide-react";
import { BuildOutlined } from "@ant-design/icons";
import { ROLE_API } from "../../services/modules/RoleServices";
import { handleDecoded } from "../../helper";

interface DefaultPageProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

const DefaultPage: React.FC<DefaultPageProps> = ({ children, showFooter }) => {
  const location = useLocation();
  const { userId } = location.state || {};
  const userDetail = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState<string>("company");
  const dispatch = useDispatch();
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleModalRole, setVisibleModalRole] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleTabChange = (id: string) => {
    setActiveTab(id);
  };
  const handleGetDetailUser = async (userId: string, access_token: string) => {
    try {
      const refresh_token = localStorage.getItem("refresh_token") || "";
      const res = await getDetailUser(userId, access_token);
      if (res.data.items) {
        dispatch(
          updateUser({
            id:res?.data?.items?._id,
            ...res?.data.items,
            access_token: access_token,
            refresh_token: refresh_token,
          })
        );
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
      }
    } catch (error) {
      notification.error({
        message: "Failed to fetch user details",
        description: error.message,
      });
    }
  };

  const handleCompleted = async() => {
    await handleGetDetailUser(userId || userDetail?._id, userDetail?.access_token);
    setVisible(false);
  };
  
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      // Lấy token từ query params
      const accessToken = urlParams.get('access_token');
      const refreshToken = urlParams.get('refresh_token');
      if (accessToken && refreshToken) {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        afterLoginGoogleFacebook(accessToken)
      }
    }, []);

    const afterLoginGoogleFacebook = async (accessToken:string)=>{
      try {
        const {token,decoded} =handleDecoded(accessToken);
        await handleGetDetailUser(decoded?.sub+"",token);
        // window.location.href=`${import.meta.env.VITE_API_URL_APP}`
        window.history.replaceState(null, '', window.location.pathname);
      } catch (error) {
        console.log(error)
      }
    }
    
  const tabs = [
    {
      id: "company",
      label: "Thông tin công ty",
      content: <CompanyInfo handleTabChange={handleTabChange} />,
    },
    {
      id: "founding",
      label: "Thông tin thành lập",
      content: <FoundingInfo handleTabChange={handleTabChange} />,
    },
    {
      id: "social",
      label: "Hồ sơ truyền thông xã hội",
      content: <SocialLinks handleTabChange={handleTabChange} />,
    },
    {
      id: "contact",
      label: "Contact",
      content: <Contact handleTabChange={handleTabChange} />,
    },
    {
      id: "completed",
      label: "Completed",
      content: <Completed handleCompleted={handleCompleted} />,
    },
  ];

  const handleCheckUpdate = async () => {
    try {
      const res = await USER_API.checkUpdateCompany(
        userId || userDetail?._id,
        userDetail?.access_token
      );
      if (res.data) {
        const { company_info, contact, founding_info, social_info } =
          res.data.progress_setup;
        if (res.data.role.role_name === "EMPLOYER") {
          if (!company_info) {
            setActiveTab("company");
            setVisible(true);
          } else if (!founding_info) {
            setActiveTab("founding");
            setVisible(true);
          } else if (!social_info) {
            setActiveTab("social");
            setVisible(true);
          } else if (!contact) {
            setActiveTab("contact");
            setVisible(true);
          } else {
            navigate("/");
            setVisible(false);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleCheckRole = async () => {
    try {
      const res = await USER_API.getDetailUser(
         userDetail?._id,
        userDetail?.access_token
      );
      if (res?.data?.items) {
        const { role } = res.data.items;
        if (!role || role === "") {
          setVisibleModalRole(true);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userDetail?.access_token) {
      handleCheckRole();
      handleCheckUpdate();
      handleGetRole()
      handleGetDetailUser(userId || userDetail?._id, userDetail?.access_token);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [children]);
  const [selectedType, setSelectedType] = useState<"user" | "employer" | null>(
    null
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [roles,setRoles]=useState<Array<any>>([])

  useEffect(() => {
    if (selectedType) {
      setIsTransitioning(true);
      const timer = setTimeout(() => setIsTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [selectedType]);

  const handleTypeSelect = (type: "user" | "employer") => {
    setSelectedType(type);
  };
  const handleContinue = async() => {
    const role = roles?.find((role)=>role.role_name === selectedType?.toUpperCase())
    const params = {
      id:userDetail?._id,
      role:role?._id
    }
    const  res = await USER_API.updateUser(params,userDetail?.access_token)
    if(res.data){
      dispatch(updateUser({...res.data}))
      window.location.reload();
    }
  };
  const handleGetRole = async()=>{
    const res = await ROLE_API.getAll(userDetail?.access_token);
    if(res.data){
      setRoles(res.data.items)
    }
  }
  const renderBody = () => {
    return (
      <div className="space-y-6">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          You are ?
        </h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Ứng Viên */}
          <div
            className={`p-6 bg-white rounded-xl border shadow-md cursor-pointer flex items-center gap-4 transition-transform duration-300 ease-in-out ${
              selectedType === "user"
                ? "ring-2 ring-blue-500 scale-105"
                : "hover:bg-gray-50 hover:scale-105"
            }`}
            style={{
              opacity: isTransitioning && selectedType !== "user" ? 0.5 : 1,
            }}
            onClick={() => handleTypeSelect("user")}
          >
            <User className="w-7 h-7 text-gray-600" />
            <span className="text-lg font-medium text-gray-700">Ứng Viên</span>
          </div>

          {/* Nhà Tuyển Dụng */}
          <div
            className={`p-6 bg-[#0A2647] rounded-xl shadow-md cursor-pointer flex items-center gap-4 transition-transform duration-300 ease-in-out ${
              selectedType === "employer"
                ? "ring-2 ring-blue-500 scale-105"
                : "hover:bg-[#0A2647]/90 hover:scale-105"
            }`}
            style={{
              opacity: isTransitioning && selectedType !== "employer" ? 0.5 : 1,
            }}
            onClick={() => handleTypeSelect("employer")}
          >
            <BuildOutlined className="w-7 h-7 text-white" />
            <span className="text-lg font-medium text-white">Nhà Tuyển Dụng</span>
          </div>
        </div>

        {/* Continue Button */}
        {selectedType && (
          <div className="flex justify-center">
            <button
              className={`relative px-6 py-3 overflow-hidden text-lg font-medium rounded-lg shadow-xl transition duration-300 ease-in-out transform ${
                selectedType === "employer"
                  ? "bg-[#0b2647] text-white"
                  : "bg-white text-[#0b2647]"
              } bg-gradient-to-r ${
                selectedType === "employer"
                  ? "from-[#0b2647] to-[#3b5998]"
                  : "from-[#ffffff] to-[#0b2647]"
              } hover:scale-105 hover:bg-gradient-to-l hover:from-[#3b5998] hover:to-[#0b2647]`}
              onClick={handleContinue}
              disabled={!selectedType}
              style={{
                background:
                  selectedType === "employer"
                    ? "linear-gradient(90deg, #0b2647, #3b5998)"
                    : "linear-gradient(90deg, #ffffff, #0b2647)",
                backgroundSize: "200% 100%",
                backgroundPosition: "left",
                transition: "background-position 0.5s ease-in-out",
              }}
            >
              Tiếp tục
            </button>
          </div>
        )}
      </div>
    );
  };
  return (
    <div>
      <Header />
      <main>{children}</main>
      {showFooter && <Footer />}
      <Modal
        footer={null}
        width={"85%"}
        style={{ top: 50 }}
        visible={visible}
        closable={false}
      >
        <AccountSetup tabs={tabs} activeTab={activeTab} />
      </Modal>
      <Modal
        footer={null}
        width={"75%"}
        style={{ top: 200 }}
        visible={visibleModalRole}
        closable={false}
      >
        {renderBody()}
      </Modal>
    </div>
  );
};

export default DefaultPage;

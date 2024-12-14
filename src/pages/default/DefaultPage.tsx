import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import { useSelector } from 'react-redux';
import { getDetailUser, USER_API } from '../../services/modules/userServices';
import AccountSetup from '../auth/Account/SetupEmployer';
import { Modal, notification } from 'antd';
import CompanyInfo from '../auth/Account/CompanyInfo';
import FoundingInfo from '../auth/Account/FoundingInfo';
import SocialLinks from '../auth/Account/SocialLinks';
import Contact from '../auth/Account/Contact';
import Completed from '../auth/Account/Completed';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slices/userSlices';

interface DefaultPageProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

const DefaultPage: React.FC<DefaultPageProps> = ({ children, showFooter }) => {
  const location = useLocation();
  const { userId } = location.state || {}; 
  const userDetail = useSelector(state=>state.user);
  const [activeTab, setActiveTab] = useState("company");
  const dispatch = useDispatch()
  const [visible,setVisible]=useState(false)
  const navigate = useNavigate();
  const handleTabChange = (id: string) => {
    setActiveTab(id);
  };
  const handleGetDetailUser = async (userId:string, access_token: string) => {
    try {
        const refresh_token = localStorage.getItem("refresh_token") || '';
        const res = await getDetailUser(userId, access_token);
        if(res.data.items){
          dispatch(
              updateUser({
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

  const handleCompleted =()=>{
    setVisible(false)
    handleGetDetailUser(userId || userDetail?._id ,userDetail?.access_token);
  }

  const tabs = [
    {
      id: "company",
      label: "Company Info",
      content: <CompanyInfo handleTabChange={handleTabChange} />,
    },
    {
      id: "founding",
      label: "Founding Info",
      content: <FoundingInfo handleTabChange={handleTabChange} />,
    },
    {
      id: "social",
      label: "Social Media Profile",
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
          if(res.data.role.role_name === "EMPLOYER"){
          if (!company_info) {
            setActiveTab("company");
          setVisible(true)

          } else if (!founding_info) {
            setActiveTab("founding");
          setVisible(true)

          } else if (!social_info) {
            setActiveTab("social");
          setVisible(true)

          } else if (!contact) {
            setActiveTab("contact");
            setVisible(true)
          } else {
            navigate("/");
          setVisible(false)
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
};

  useEffect(() => {
    if(userDetail?.access_token){
      handleCheckUpdate();
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [children]);
  
  return (
    <div>
      <Header />
      <main>
        {children}
      </main>
      {showFooter && <Footer />}
        <Modal footer={null} width={'85%'} style={{top:50}} visible={visible} closable={false}>
           <AccountSetup tabs={tabs} activeTab={activeTab} />
        </Modal>
    </div>
  );
};

export default DefaultPage;


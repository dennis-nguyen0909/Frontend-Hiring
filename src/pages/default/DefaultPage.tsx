import React, { useEffect } from 'react';
import Header from '../../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import { useSelector } from 'react-redux';
import { USER_API } from '../../services/modules/userServices';

interface DefaultPageProps {
  children: React.ReactNode;
  showFooter?: boolean; // Đảm bảo showFooter có thể là optional
}

const DefaultPage: React.FC<DefaultPageProps> = ({ children, showFooter }) => {
  const accessToken = localStorage.getItem('access_token');
  const navigate = useNavigate();
  const userDetail = useSelector(state=>state.user);
  const handleCheckUpdate =async ()=>{
    try {
      if (userDetail?.role?.role_name === "EMPLOYER") {
      const res = await USER_API.checkUpdateCompany(userDetail?._id,userDetail?.access_token);
      if(res.data){
        const {company_info,contact,founding_info,social_info} = res.data.progress_setup
        if(!company_info || !contact || !founding_info || !social_info){
          navigate('/account-setup')
        }
      }
    }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    if (userDetail && userDetail._id && userDetail.access_token) {
      handleCheckUpdate();
    }
  }, [userDetail]);
  useEffect(() => {
    if (accessToken) {
      navigate('/');
    }
  }, [accessToken]);

  // Scroll to top when the page is changed
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [children]); // Trigger scroll when children change
  
  return (
    <div>
      <Header />
      <main>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default DefaultPage;


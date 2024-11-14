import React, { useEffect } from 'react';
import Header from '../../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';

interface DefaultPageProps {
  children: React.ReactNode; // Nhận nội dung các trang con thông qua props
}

const DefaultPage: React.FC<DefaultPageProps> = ({ children,showFooter }) => {
  const accessToken = localStorage.getItem('access_token');
  const navigate = useNavigate();
  useEffect(()=>{
    if(accessToken){
      navigate('/')
    }
  },[accessToken])
  return (
    <div >
      {/* Header có thể tái sử dụng trên nhiều trang */}
      <Header />

      {/* Nội dung của các trang sẽ được render tại đây */}
      <main>
        {children}
      </main>

      {/* Footer có thể tái sử dụng */}
        
        {showFooter && <Footer />}
    </div>
  );
};

export default DefaultPage;

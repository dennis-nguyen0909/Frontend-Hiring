import React, { useEffect } from 'react';
import Header from '../../components/Header/Header';
import { useNavigate } from 'react-router-dom';

interface DefaultPageProps {
  children: React.ReactNode; // Nhận nội dung các trang con thông qua props
}

const DefaultPage: React.FC<DefaultPageProps> = ({ children }) => {
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

{/* 
      <footer>
        <p>© 2024 My Application. All rights reserved.</p>
      </footer> */}
    </div>
  );
};

export default DefaultPage;

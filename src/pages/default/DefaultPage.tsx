import React, { useEffect } from 'react';
import Header from '../../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';

interface DefaultPageProps {
  children: React.ReactNode;
  showFooter?: boolean; // Đảm bảo showFooter có thể là optional
}

const DefaultPage: React.FC<DefaultPageProps> = ({ children, showFooter }) => {
  const accessToken = localStorage.getItem('access_token');
  const navigate = useNavigate();

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


import React from 'react';
import Header from '../../components/Header/Header';

interface DefaultPageProps {
  children: React.ReactNode; // Nhận nội dung các trang con thông qua props
}

const DefaultPage: React.FC<DefaultPageProps> = ({ children }) => {
  return (
    <div>
      {/* Header có thể tái sử dụng trên nhiều trang */}
      <Header />

      {/* Nội dung của các trang sẽ được render tại đây */}
      <main>
        {children}
      </main>

      {/* Footer có thể tái sử dụng */}
      <footer>
        <p>© 2024 My Application. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DefaultPage;

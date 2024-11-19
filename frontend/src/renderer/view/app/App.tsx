import React, { useEffect } from 'react';
import AppRoutes from '@renderer/router';
import TitleBar from '@renderer/components/common/TitleBar';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import './App.scss';
import AppTheme from '../shared-theme/AppTheme';

function RouteElement() {
  const element = useRoutes(AppRoutes);
  return element;
}

const App = () => {
  const navigate = useNavigate();
   const location = useLocation();
   console.log("======CURRENT PATH========",location.pathname)

 useEffect(() => {
   const token = window.electronAPI.getToken();

   if (!token && location.pathname !== '/signin' && location.pathname !== '/signup') {
     navigate('/signin');
   } else if (token && location.pathname === '/signin') {
     
     navigate('/');
   }
 }, [navigate, location]);

  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 12,
          colorPrimary: '#4285F4',
        },
      }}
    >
      <AppTheme>
        <div className="ease-app">
          {/* <TitleBar title="header" /> */}
          <main className="ease-main">
            <RouteElement />
          </main>
        </div>
      </AppTheme>
    </ConfigProvider>
  );
};

export default App;

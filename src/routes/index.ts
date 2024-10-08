import { ComponentType } from 'react';
import HomePage from '../pages/home/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import NotFound from '../components/NotFound/NotFound';
import { JobPage } from '../pages/job/JobPage';
import Register from '../pages/auth/RegisterPage';
import AdminPage from '../pages/admin/AdminPage';
import VerifyEmail from '../pages/auth/VerifyEmail';
import ForgotPage from '../pages/auth/ForgotPage';
import ResetPage from '../pages/auth/ResetPage';
interface IRoute {
    path: string;
    page: ComponentType ;
    isShowHeader?: boolean;
    isPrivate?: boolean;
}

export const routes: IRoute[] = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
        isPrivate:false,
    },
    {
        path: '/login',
        page: LoginPage,
        isShowHeader: false,
    },
    {
        path: '/register',
        page: Register,
        isShowHeader: false,
    },
    {
        path: '/jobs',
        page: JobPage,
        isShowHeader: true,
    },
    {
        path: '/admin',
        page: AdminPage,
        isShowHeader: true,
    },
    {
        path:'/verify',
        page:VerifyEmail,
        isShowHeader:false
    },
    {
        path:'/forgot-password',
        page: ForgotPage,
        isShowHeader:false
    },
    {
        path:'/reset-password',
        page: ResetPage,
        isShowHeader:false
    }
];

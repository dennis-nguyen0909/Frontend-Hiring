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
import UserDetail from '../pages/detail/UserDetail';
import Profile from '../pages/detail/Profile/Profile';
import ManagePage from '../pages/employer/manage/ManagePage';
import DashBoard from '../pages/dashboard';
import UploadPDF from '../pages/detail/UploadPDF/UploadPDF';
import ProfileCV from '../pages/detail/ProfileCV/ProfileCV';
interface IRoute {
    path: string;
    page: ComponentType ;
    isShowHeader?: boolean;
    isPrivate?: boolean;
    isShowFooter?:boolean;
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
    },
    {
        path:'/setting-profile/:id',
        page: UserDetail,
        isShowHeader:true
    },
    {
        path:'/profile/:id',
        page: Profile,
        isShowHeader:true
    },
    {
        path:'/employer/:id',
        page: ManagePage,
        isShowHeader:true
    },
    {
        path:'/dashboard',
        page: DashBoard,
        isShowHeader:true,
        isShowFooter:false
    },
    {
        path:'/upload-cv',
        page: UploadPDF,
        isShowHeader:true,
        isShowFooter:false
    },
    {
        path:'/profile-cv',
        page: ProfileCV,
        isShowHeader:true,
        isShowFooter:false
    },
    {
        path: '*',
        page: NotFound,
        isShowHeader: false,
    },
    
];

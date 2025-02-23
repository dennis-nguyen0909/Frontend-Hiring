import { ComponentType, lazy } from 'react';
import HomePage from '../pages/home/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import NotFound from '../components/NotFound/NotFound';
import Register from '../pages/auth/RegisterPage';
import AdminPage from '../pages/admin/AdminPage';
import VerifyEmail from '../pages/auth/VerifyEmail';
import ForgotPage from '../pages/auth/ForgotPage';
import ResetPage from '../pages/auth/ResetPage';
import UserDetail from '../pages/detail/UserDetail';
import Profile from '../pages/detail/Profile/Profile';
import ManagePage from '../pages/employer/manage/ManagePage';

import UploadPDF from '../pages/detail/UploadPDF/UploadPDF';
import ProfileCV from '../pages/detail/ProfileCV/ProfileCV';
// import JobSearchPage from '../pages/job/JobPage';
import JobDetail from '../pages/JobDetail/JobDetail';
import MyJobDetail from '../pages/dashboard/employer/MyJob/JodDetail'
import MyApplicationDetail from '../pages/dashboard/employer/MyJob/JobApplication'
import EmployerDetail from '../pages/EmployerDetail/EmployerDetail';
import AboutPage from '../pages/about';
import EmployeesPage from '../pages/PageEmployers';
import LandingPageExtended from '../components/LandingPageFeatures/LandingPageFeatures';
import EmployerJob from '../pages/EmployerJob/EmployerJob';
import JobPosting from '../pages/JobDetail/JobPosting';
import SystemActivities from '../pages/SystemActivities/SystemActivities';

const JobSearchPage = lazy(()=>import('../pages/job/JobPage'));
const JobBoard = lazy(()=>import('../pages/job/JobBoard'));
const DashBoard = lazy(()=>import ('../pages/dashboard'));
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
        page: JobBoard,
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
        path:'/job-information/:id',
        page: JobPosting,
        isShowHeader:true
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
        path:'/employer-detail/:id',
        page: EmployerDetail,
        isShowHeader:true
    },
    {
        path:'/dashboard/:id',
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
        path:'/employer/:id/jobs',
        page: EmployerJob,
        isShowHeader:true,
        isShowFooter:false
    },
    {
        path:'/about',
        page: AboutPage,
        isShowHeader:true,
        isShowFooter:true
    },
    {
        path:'/employers',
        page: EmployeesPage,
        isShowHeader:true,
        isShowFooter:true
    },
    {
        path:'/features',
        page: LandingPageExtended,
        isShowHeader:false,
        isShowFooter:true
    },
    {
        path:'/my-job-detail/:id',
        page: MyJobDetail,
        isShowHeader:true,
        isShowFooter:true
    },
    {
        path:'/my-application/:id',
        page: MyApplicationDetail,
        isShowHeader:true,
        isShowFooter:true
    },
    {
        path:'/system/activities',
        page: SystemActivities,
        isShowHeader:true,
        isShowFooter:true
    },
    {
        path: '*',
        page: NotFound,
        isShowHeader: false,
    },

    
];

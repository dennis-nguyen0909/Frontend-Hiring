import { lazy } from "react";
import { IRoute } from "./types";
import { authRoutes } from "./groups/auth";
import { jobsRoutes } from "./groups/jobs";
import NotFound from "../components/NotFound/NotFound";
import AdminPage from "../pages/admin/AdminPage";
import UserDetail from "../pages/detail/UserDetail";
import Profile from "../pages/detail/Profile/Profile";
import ManagePage from "../pages/employer/manage/ManagePage";
import UploadPDF from "../pages/detail/UploadPDF/UploadPDF";
import EmployerDetail from "../pages/EmployerDetail/EmployerDetail";
import LandingPageExtended from "../components/LandingPageFeatures/LandingPageFeatures";
import SystemActivities from "../pages/SystemActivities/SystemActivities";

const HomePage = lazy(() => import("../pages/home/HomePage"));
const ProfileCV = lazy(() => import("../pages/detail/ProfileCV/ProfileCV"));
const EmployeesPage = lazy(() => import("../pages/PageEmployers"));
const AboutPage = lazy(() => import("../pages/about"));
const DashBoard = lazy(() => import("../pages/dashboard"));

export const publicRoutes: IRoute[] = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
    title: "Home",
  },
  {
    path: "/about",
    page: AboutPage,
    isShowHeader: true,
    isShowFooter: true,
    title: "About",
  },
  {
    path: "/companies",
    page: EmployeesPage,
    isShowHeader: true,
    isShowFooter: true,
    title: "Companies",
  },
  {
    path: "/features",
    page: LandingPageExtended,
    isShowHeader: false,
    isShowFooter: true,
    title: "Features",
  },
];

export const privateRoutes: IRoute[] = [
  {
    path: "/admin",
    page: AdminPage,
    isShowHeader: true,
    isPrivate: true,
    roles: ["ADMIN"],
    title: "Admin",
  },
  {
    path: "/setting-profile/:id",
    page: UserDetail,
    isShowHeader: true,
    isPrivate: true,
    title: "Profile Settings",
  },
  {
    path: "/profile/:id",
    page: Profile,
    isShowHeader: true,
    isPrivate: true,
    title: "Profile",
  },
  {
    path: "/employer/:id",
    page: ManagePage,
    isShowHeader: true,
    isPrivate: true,
    roles: ["EMPLOYER"],
    title: "Employer Management",
  },
  {
    path: "/employer-detail/:id",
    page: EmployerDetail,
    isShowHeader: true,
    isPrivate: true,
    title: "Employer Details",
  },
  {
    path: "/dashboard/:id",
    page: DashBoard,
    isShowHeader: true,
    isShowFooter: false,
    isPrivate: true,
    title: "Dashboard",
  },
  {
    path: "/upload-cv",
    page: UploadPDF,
    isShowHeader: true,
    isShowFooter: false,
    isPrivate: true,
    title: "Upload CV",
  },
  {
    path: "/profile-cv",
    page: ProfileCV,
    isShowHeader: true,
    isShowFooter: false,
    isPrivate: true,
    title: "CV Profile",
  },
  {
    path: "/system/activities",
    page: SystemActivities,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true,
    title: "System Activities",
  },
];

export const routes: IRoute[] = [
  ...publicRoutes,
  ...authRoutes,
  ...jobsRoutes,
  ...privateRoutes,
  {
    path: "*",
    page: NotFound,
    isShowHeader: false,
    title: "Not Found",
  },
];

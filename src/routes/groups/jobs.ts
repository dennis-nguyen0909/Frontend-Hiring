import { lazy } from "react";
import { IRoute } from "../types";
import JobPosting from "../../pages/JobDetail/JobPosting";
import EmployerJob from "../../pages/EmployerJob/EmployerJob";
import MyJobDetail from "../../pages/dashboard/employer/MyJob/JodDetail";
import MyApplicationDetail from "../../pages/dashboard/employer/MyJob/JobApplication";

const JobBoard = lazy(() => import("../../pages/job/JobBoard"));

export const jobsRoutes: IRoute[] = [
  {
    path: "/jobs",
    page: JobBoard,
    isShowHeader: true,
    title: "Job Board",
  },
  {
    path: "/job-information/:id",
    page: JobPosting,
    isShowHeader: true,
    title: "Job Information",
  },
  {
    path: "/employer/:id/jobs",
    page: EmployerJob,
    isShowHeader: true,
    isShowFooter: false,
    title: "Employer Jobs",
  },
  {
    path: "/my-job-detail/:id",
    page: MyJobDetail,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true,
    roles: ["EMPLOYER"],
    title: "Job Detail",
  },
  {
    path: "/my-application/:id",
    page: MyApplicationDetail,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true,
    roles: ["EMPLOYER"],
    title: "Application Detail",
  },
];

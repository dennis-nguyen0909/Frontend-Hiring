import { IRoute } from "../types";
import LoginPage from "../../pages/auth/LoginPage";
import Register from "../../pages/auth/RegisterPage";
import VerifyEmail from "../../pages/auth/VerifyEmail";
import ForgotPage from "../../pages/auth/ForgotPage";
import ResetPage from "../../pages/auth/ResetPage";

export const authRoutes: IRoute[] = [
  {
    path: "/login",
    page: LoginPage,
    isShowHeader: false,
    title: "Login",
  },
  {
    path: "/register",
    page: Register,
    isShowHeader: false,
    title: "Register",
  },
  {
    path: "/verify",
    page: VerifyEmail,
    isShowHeader: false,
    title: "Verify Email",
  },
  {
    path: "/forgot-password",
    page: ForgotPage,
    isShowHeader: false,
    title: "Forgot Password",
  },
  {
    path: "/reset-password",
    page: ResetPage,
    isShowHeader: false,
    title: "Reset Password",
  },
];

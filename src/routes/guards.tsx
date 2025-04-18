import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { IRoute } from "./types";
import { useSelector } from "react-redux";

interface AuthGuardProps {
  children: ReactNode;
  route: IRoute;
}

export const AuthGuard = ({ children, route }: AuthGuardProps) => {
  const isAuthenticated = true;
  const user = useSelector((state) => state.user);
  if (route.isPrivate && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (route.roles && !route.roles.includes(user?.role?.role_name)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

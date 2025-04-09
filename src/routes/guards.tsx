import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { IRoute } from "./types";

interface AuthGuardProps {
  children: ReactNode;
  route: IRoute;
}

export const AuthGuard = ({ children, route }: AuthGuardProps) => {
  // TODO: Implement your authentication logic here
  const isAuthenticated = true; // Replace with actual auth check
  const userRole = "user"; // Replace with actual user role

  if (route.isPrivate && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (route.roles && !route.roles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

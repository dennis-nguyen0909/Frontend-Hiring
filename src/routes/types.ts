import { ComponentType } from "react";

export type RouteParams = {
  "/job-information/:id": { id: string };
  "/setting-profile/:id": { id: string };
  "/profile/:id": { id: string };
  "/employer/:id": { id: string };
  "/employer-detail/:id": { id: string };
  "/dashboard/:id": { id: string };
  "/my-job-detail/:id": { id: string };
  "/my-application/:id": { id: string };
};

export interface IRoute {
  path: string;
  page: ComponentType;
  isShowHeader?: boolean;
  isPrivate?: boolean;
  isShowFooter?: boolean;
  roles?: string[]; // For role-based access control
  title?: string; // For page title
}

export type RouteGroup = {
  name: string;
  routes: IRoute[];
};

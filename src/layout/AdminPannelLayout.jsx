import React, { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { MangeRoles, Roles } from "@/utils/roles";
import { GetUser } from "@/Network/Super_Admin/auth";
import { useSelector } from "react-redux";

export const AdminPannelLayout = () => {
  const [roles, setRoles] = useState({});
  const navigate = useNavigate();
  const [path, setPath] = useState({
    currentpath: "",
    paths: [],
  });
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!token && !storedToken) {
      navigate("/login", { replace: true });
      return;
    }

    const user = GetUser();
    if (!user) {
      localStorage.removeItem('token');
      navigate("/login", { replace: true });
      return;
    }
    const resolveRole = () => {
      switch (user.role) {
        case Roles.SCHOOLADMIN:
          return Roles.SCHOOLADMIN;
        case Roles.SUPERADMIN:
          return Roles.SUPERADMIN;
        case Roles.TEACHER:
          return Roles.TEACHER;
        case Roles.ACCOUNT:
          return Roles.ACCOUNT;
        default:
          return null;
      }
    };

    const userRole = resolveRole();

    try {
      const roleData = MangeRoles(userRole);
      setRoles(roleData);
    } catch (err) {
      console.error("Invalid role for MangeRoles:", err);
    }
  }, []);


  useEffect(() => {
    const pathsArr = location.pathname.split("/").filter(Boolean);

    setPath({
      currentpath: location.pathname,
      paths: pathsArr,
    });
  }, [location]);


  return (
    <SidebarProvider>
      <AppSidebar data={roles} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 fixed bg-white w-full z-30">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {path.paths.map((item, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href={path.currentpath || "#"}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {index < path.paths.length - 1 && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="w-full h-full p-4 mt-16 overflow-x-auto">
          <Outlet />
        </div>

      </SidebarInset>
    </SidebarProvider>
  );
};

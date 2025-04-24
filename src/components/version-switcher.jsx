import * as React from "react";
import {SidebarMenu,SidebarMenuButton,SidebarMenuItem,} from "@/components/ui/sidebar";
import { BookOpen } from "lucide-react";
import { GetUser } from "@/Network/Super_Admin/auth";
import { useState } from "react";
import { useEffect } from "react";
import { Roles } from "@/utils/roles";

export function VersionSwitcher({title="Admin Pannel"}) {
  const [role, setRole] = useState(null);
  useEffect(() => {
    const user = GetUser();  
    const resolveRole = () => {
      switch (user?.role) {
        case Roles.SCHOOLADMIN:
          return "School Admin";
        case Roles.SUPERADMIN:
          return "Super Admin";
        case Roles.TEACHER:
          return "Teacher Admin";
        default:
          return null;
      }
    };
  
    const userRole = resolveRole();
    setRole(userRole);
  }, []);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            
            <BookOpen className="size-4"/>
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-medium">Eduworm</span>
            <span className="">{role} Dashboard</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

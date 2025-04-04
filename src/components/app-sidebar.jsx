import React, { useState } from "react";
import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

// Sample Data
const data = {
  navMain: [
    {
      title: "Home",
      items: [
        { title: "Home", url: "/super-admin-pannel/home" },
      ],
    },
    {
      title: "Manage Content",
      items: [
        { title: "Course Curriculum", url: '/course-curriculum' },
        { title: "Add Video Chapters", url: "/video-chaper-upload" },
        { title: "Add Learning Game", url: "/add-learning-game" },
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleDropdown = (title) => {
    setOpenMenu(openMenu === title ? null : title);
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className={'mt-4'}>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title} className={"py-0"}>
            <SidebarGroupLabel
              onClick={() => toggleDropdown(item.title)}
              className="flex justify-between items-center py-5 cursor-pointer border text-[14px]"
            >
              {item.title}
              {openMenu === item.title ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </SidebarGroupLabel>
            <SidebarGroupContent className={openMenu === item.title ? "block" : "hidden"}>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton asChild>
                      <Link href={subItem.url}>{subItem.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

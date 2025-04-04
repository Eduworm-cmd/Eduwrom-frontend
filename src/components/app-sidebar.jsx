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

// Sample Data
const data = {
  navMain: [
    {
      title: "Getting Started",
      items: [
        { title: "Installation", url: "#" },
        { title: "Project Structure", url: "#" },
      ],
    },
    {
      title: "Components",
      items: [
        { title: "Buttons", url: "#" },
        { title: "Forms", url: "#" },
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
                      <a href={subItem.url}>{subItem.title}</a>
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

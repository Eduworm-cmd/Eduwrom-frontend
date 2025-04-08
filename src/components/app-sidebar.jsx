import React, { useState } from "react";
import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
import { FooterUserDropdown } from "./FooterUserDropdown/FooterUserDropdown";

export function AppSidebar({ data, ...props }) {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleDropdown = (title) => {
    setOpenMenu(openMenu === title ? null : title);
  };

  if (!data || !data.navMain) {
    return <div>Loading...</div>;
  }


  function truncateAfterWords(str, wordLimit = 3) {
    const words = str.split(' ');
    if (words.length <= wordLimit) return str;
    return words.slice(0, wordLimit).join(' ') + '...';
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher />
        <SearchForm />
      </SidebarHeader>
      {data.buttons && (
          <div className="buttons">
            {data.buttons.map((button) => (
              <SidebarGroupLabel
                className="flex justify-center mt-4 text-white items-center py-5 cursor-pointer border-2 text-[14px] w-60 mx-auto text-left px-3 bg-sky-500"
              >
                <Link to={button.url} className="flex items-center py-2">
                  <button.icon size={16} />
                  <span className="ml-2">{button.title}</span>
                </Link>

              </SidebarGroupLabel>
            ))}
          </div>
        )}
      <SidebarContent className={"mt-2"}>
        {/* Rendering Buttons outside of navMain */}
        

        {/* Rendering Sidebar Groups for each navMain section */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title} className={"py-0"}>
            {/* Render Buttons inside each Section (if exists) */}
            {item.buttons && item.buttons.length > 0 && (
              <div className="buttons">
                {item.buttons.map((button) => (
                  <SidebarGroupLabel
                    key={button.title}
                    className="flex justify-between items-center py-5 cursor-pointer border text-[14px]"
                  >
                    <Link to={button.url}>
                      {button.icon && <button.icon size={16} />}
                      {button.title}
                    </Link>
                  </SidebarGroupLabel>
                ))}
              </div>
            )}

            {/* Render Dropdown for nav items */}
            <SidebarGroupLabel
              onClick={() => toggleDropdown(item.title)}
              className="flex justify-between items-center text-left py-5 cursor-pointer border text-[14px]"
            >
              {/* <item.icon size={16} /> */}

              {truncateAfterWords(item.title)}
              {openMenu === item.title ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </SidebarGroupLabel>

            {/* Render Items inside the dropdown */}
            <SidebarGroupContent
              className={openMenu === item.title ? "block" : "hidden"}
            >
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton asChild>
                      <Link to={subItem.url}>{subItem.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <FooterUserDropdown/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

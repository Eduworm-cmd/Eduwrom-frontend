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
    const words = str.split(" ");
    if (words.length <= wordLimit) return str;
    return words.slice(0, wordLimit).join(" ") + "...";
  }

  return (
    <Sidebar {...props}>
      {/* Header with version switcher and search */}
      <SidebarHeader style={{"marginLeft": "-8px"}}>
        <VersionSwitcher />
        <SearchForm />
      </SidebarHeader>

      {/* Main Sidebar Content */}
      <SidebarContent className="">
        {data.buttons && (
          <div className="px-2">
            {data.buttons.map((button) => (
              <Link to={button.url} key={button.title}>
                <div className="flex items-center space-x-2 mb-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md w-full text-sm font-medium transition-all h-12">
                  <button.icon size={18} />
                  <span className="truncate">{truncateAfterWords(button.title)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Sidebar Dropdown Menus */}
        <div className="">
          {data.navMain.map((item) => (
            <SidebarGroup key={item.title}>
              {/* Dropdown Toggle Button */}
              <button
                onClick={() => toggleDropdown(item.title)}
                className="flex items-center justify-between w-full text-left bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-md transition-all text-sm font-medium h-12"
              >
                <div className="flex items-center space-x-2">
                  {item.icon && <item.icon size={18} />}
                  <span className="truncate">{truncateAfterWords(item.title)}</span>
                </div>
                {openMenu === item.title ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>

              {/* Dropdown Items */}
              <SidebarGroupContent
                className={`transition-all duration-300 ease-in-out ${openMenu === item.title ? "block mt-1" : "hidden"
                  }`}
              >
                <SidebarMenu className="block px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-all"
                >
                  {item.items.map((subItem) => (
                    <SidebarMenuItem key={subItem.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          to={subItem.url}
                        >
                          {subItem.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </div>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <FooterUserDropdown />
      </SidebarFooter>

      {/* Sidebar Collapse Button */}
      <SidebarRail />
    </Sidebar>
  );
}

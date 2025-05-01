import React, { useEffect, useState } from "react";
import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  NotebookPen,
  Users,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { FooterUserDropdown } from "./FooterUserDropdown/FooterUserDropdown";
import axios from "axios";
import clsx from "clsx";

const iconMap = {
  Users: Users,
  NotebookPen: NotebookPen,
  LayoutDashboard: LayoutDashboard,
  Settings: Settings,
};

export function AppSidebar(props) {
  const role = "superadmin";
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleDropdown = (title) => {
    setOpenMenu(openMenu === title ? null : title);
  };

  function truncateAfterWords(str, wordLimit = 3) {
    const words = str.split(" ");
    if (words.length <= wordLimit) return str;
    return words.slice(0, wordLimit).join(" ") + "...";
  }

  const transformMenuData = (data) => {
    if (data && typeof data === "object" && "buttons" in data && "navMain" in data) {
      return data;
    }

    if (Array.isArray(data)) {
      const roleItems = data.filter((item) => item.forRole === role && item.isActive);

      const buttons = roleItems
        .filter((item) => item.type === "button")
        .sort((a, b) => a.order - b.order);

      const footersBtns = roleItems
        .filter((item) => item.type === "footerBtn")
        .sort((a, b) => a.order - b.order);

      const parentMenus = roleItems
        .filter((item) => item.type === "main" && item.isParent && item.parent === null)
        .sort((a, b) => a.order - b.order);

      const navMain = parentMenus.map((parent) => {
        const childItems = roleItems
          .filter((item) => item.parent === parent.title && !item.isParent)
          .sort((a, b) => a.order - b.order);

        return {
          ...parent,
          items: childItems,
        };
      });

      return {
        title: "School Admin Panel",
        buttons,
        footersBtns,
        navMain,
      };
    }

    return null;
  };

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/menu/${role}`);
        const transformedData = transformMenuData(response.data.data);
        setMenuData(transformedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching menu data:", error);
        setLoading(false);
      }
    };
    fetchTabs();
  }, [role]);

  const resolveIcon = (iconName) => {
    return typeof iconName === "string" ? iconMap[iconName] || LayoutDashboard : iconName;
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="-ml-2">
        <VersionSwitcher />
        <SearchForm />
      </SidebarHeader>

      <SidebarContent>
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : !menuData ? (
          <div className="p-4 text-center">No menu data available</div>
        ) : (
          <>
            {/* Top Buttons */}
            {menuData.buttons?.length > 0 && (
              <div className="px-2">
                {menuData.buttons.map((button, index) => {
                  const ButtonIcon = resolveIcon(button.icon);
                  return (
                    <Link to={button.url} key={index}>
                      <div className="flex items-center space-x-2 bg-sky-500 text-white px-4 w-full text-md font-medium transition-all h-12">
                        <ButtonIcon size={20} />
                        <span className="truncate">{truncateAfterWords(button.title)}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Sidebar Groups */}
            {menuData.navMain?.map((item, index) => {
              const ItemIcon = resolveIcon(item.icon);
              return (
                <SidebarGroup key={index} className="">
                  {/* Group Button */}
                  <button
                    onClick={() => toggleDropdown(item.title)}
                    className={clsx(
                      "flex items-center mt-[-8px] bg-sky-200 justify-between w-full px-4 py-3 cursor-pointer transition-all text-sm font-semibold tracking-wide",
                      openMenu === item.title
                        ? "bg-sky-200 text-black"
                        : "hover:bg-sky-100 text-gray-800"
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <ItemIcon size={18} />
                      <span className="truncate">{truncateAfterWords(item.title)}</span>
                    </div>
                    {openMenu === item.title ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  {/* Dropdown Submenu */}
                  <SidebarGroupContent
                    className={`transition-all duration-300 ease-in-out ${
                      openMenu === item.title ? "block mt-0" : "hidden"
                    }`}
                  >
                    
                    <SidebarMenu className="">
                      {item.items?.map((subItem, subIndex) => (
                        <SidebarMenuItem key={subIndex}>
                          <div asChild className="">
                            <Link
                              to={subItem.url}
                              className={clsx(
                                "w-full block px-4 py-2 text-base font-medium transition-all text-left mt-1",
                                location.pathname === subItem.url
                                  ? "bg-sky-100 font-semibold text-sky-800"
                                  : "text-gray-700 hover:bg-gray-200"
                              )}
                            >
                              {subItem.title}
                            </Link>
                          </div>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              );
            })}
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        <FooterUserDropdown />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

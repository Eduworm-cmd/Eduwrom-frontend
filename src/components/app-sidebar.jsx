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
import { ChevronDown, ChevronRight, LayoutDashboard, NotebookPen, Users, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { FooterUserDropdown } from "./FooterUserDropdown/FooterUserDropdown";
import axios from "axios";

// Map string icon names to actual Lucide icon components
const iconMap = {
  Users: Users,
  NotebookPen: NotebookPen,
  LayoutDashboard: LayoutDashboard,
  Settings: Settings
};

export function AppSidebar(props) {
  const role = "superadmin";
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

  // Function to transform array data into hierarchical structure
  const transformMenuData = (data) => {
    // Handle the pre-structured object format
    if (data && typeof data === 'object' && 'buttons' in data && 'navMain' in data) {
      return data;
    }

    // Handle array format (original implementation)
    if (Array.isArray(data)) {
      // Filter items for the current role
      const roleItems = data.filter(item => item.forRole === role && item.isActive);

      // Extract buttons
      const buttons = roleItems.filter(item => item.type === "button")
        .sort((a, b) => a.order - b.order);

      // Extract footer buttons
      const footersBtns = roleItems.filter(item => item.type === "footerBtn")
        .sort((a, b) => a.order - b.order);

      // Get parent menu items
      const parentMenus = roleItems.filter(item =>
        item.type === "main" && item.isParent && item.parent === null
      ).sort((a, b) => a.order - b.order);

      // Build navMain structure
      const navMain = parentMenus.map(parent => {
        // Find all child items for this parent
        const childItems = roleItems.filter(item =>
          item.parent === parent.title && !item.isParent
        ).sort((a, b) => a.order - b.order);

        return {
          ...parent,
          items: childItems
        };
      });

      return {
        title: "School Admin Panel", // Default title
        buttons,
        footersBtns,
        navMain
      };
    }

    // If neither format matches, return null
    return null;
  };

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/menu/${role}`);
        console.log("Raw API response:", response.data.data);
        const transformedData = transformMenuData(response.data.data);
        console.log("Transformed data:", transformedData);
        setMenuData(transformedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching menu data:", error);
        setLoading(false);
      }
    };
    fetchTabs();
  }, [role]);

  // Helper function to resolve icon component from string or component
  const resolveIcon = (iconName) => {
    if (typeof iconName === "string") {
      return iconMap[iconName] || LayoutDashboard; // Default to LayoutDashboard if not found
    }
    return iconName;
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader style={{ marginLeft: "-8px" }}>
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
            {menuData.buttons && menuData.buttons.length > 0 && (
              <div className="px-2">
                {menuData.buttons.map((button, index) => {
                  const ButtonIcon = resolveIcon(button.icon);
                  return (
                    <Link to={button.url} key={index}>
                      <div className="flex items-center space-x-2 mb-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md w-full text-sm font-medium transition-all h-12">
                        <ButtonIcon size={18} />
                        <span className="truncate">{truncateAfterWords(button.title)}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            <div>
              {menuData.navMain && menuData.navMain.map((item, index) => {
                const ItemIcon = resolveIcon(item.icon);
                return (
                  <SidebarGroup key={index}>
                    <button
                      onClick={() => toggleDropdown(item.title)}
                      className="flex items-center justify-between w-full text-left bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-md transition-all text-sm font-medium h-12"
                    >
                      <div className="flex items-center space-x-2">
                        <ItemIcon size={18} />
                        <span className="truncate">{truncateAfterWords(item.title)}</span>
                      </div>
                      {openMenu === item.title ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>

                    <SidebarGroupContent
                      className={`transition-all duration-300 ease-in-out ${openMenu === item.title ? "block mt-1" : "hidden"}`}
                    >
                      <SidebarMenu className="block px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-all">
                        {item.items && item.items.map((subItem, subIndex) => (
                          <SidebarMenuItem key={subIndex}>
                            <SidebarMenuButton asChild>
                              <Link to={subItem.url}>{subItem.title}</Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                );
              })}
            </div>
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
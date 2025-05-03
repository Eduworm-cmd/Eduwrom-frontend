import React, { useState } from "react";
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
} from "@/components/ui/sidebar";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { FooterUserDropdown } from "./FooterUserDropdown/FooterUserDropdown";
import clsx from "clsx";

export function AppSidebar({ data }) {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const toggleDropdown = (menuTitle) => {
    setOpenMenu(openMenu === menuTitle ? null : menuTitle);
  };

  const truncateAfterWords = (text, wordCount = 3) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= wordCount) return text;
    return words.slice(0, wordCount).join(" ") + "...";
  };

  if (!data || Object.keys(data).length === 0) {
    return (
      <Sidebar>
        <SidebarHeader className="-ml-2">
          <VersionSwitcher />
          <SearchForm />
        </SidebarHeader>
        <SidebarContent>
          <div className="p-4 text-center text-gray-500">No menu available</div>
        </SidebarContent>
        <SidebarFooter>
          <FooterUserDropdown />
        </SidebarFooter>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <SidebarHeader className="-ml-2">
        <VersionSwitcher />
        <SearchForm />
      </SidebarHeader>

      <SidebarContent>
        {/* Top Buttons */}
        {data.buttons?.length > 0 && (
          <div className="px-2">
            {data.buttons.map((button, index) => {
              const ButtonIcon = button.icon;
              return (
                <Link to={button.url} key={index}>
                  <div className="flex items-center space-x-2 bg-sky-500 text-black px-4 w-full text-md font-medium transition-all h-12 mb-2">
                    <ButtonIcon size={20} />
                    <span className="truncate">{truncateAfterWords(button.title)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Sidebar Groups */}
        {data.navMain?.map((item, index) => {
          const ItemIcon = item.icon;
          return (
            <SidebarGroup key={index} className="mt-[-10px]">
              <button
                onClick={() => toggleDropdown(item.title)}
                className={clsx(
                  "flex items-center bg-sky-200 justify-between w-full px-4 py-3 cursor-pointer transition-all text-sm font-semibold tracking-wide",
                  openMenu === item.title
                    ? "bg-sky-200 text-black"
                    : "hover:bg-sky-100 text-gray-800"
                )}
              >
                <div className="flex items-center space-x-2">
                  {ItemIcon && <ItemIcon size={18} />}
                  <span className="truncate">{truncateAfterWords(item.title)}</span>
                </div>
                {openMenu === item.title ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
                {/* Dropdown Btn  */}
              <SidebarGroupContent
                className={`transition-all duration-300 ease-in-out ${openMenu === item.title ? "block mt-0" : "hidden"
                  }`}
              >
                <SidebarMenu>
                  {item.items?.map((subItem, subIndex) => (
                    <SidebarMenuItem key={subIndex}>
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
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}

        {/* Footer Btn */}
        {data.footersBtns?.length > 0 && (
          <div className="w-full px-2">
            {data.footersBtns.map((btn, index) => {
              const BtnIcon = btn.icon;
              return (
                <Link to={btn.url} key={index}>
                  <div className="flex items-center space-x-2 bg-sky-500 text-black px-4 w-full text-md font-medium transition-all h-12">
                    <BtnIcon size={20} />
                    <span className="truncate">{truncateAfterWords(btn.title)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </SidebarContent>

      <SidebarFooter>
        <FooterUserDropdown />
      </SidebarFooter>
    </Sidebar>
  );
}
